// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { Pausable } from "@openzeppelin/contracts/utils/Pausable.sol";

interface IVibranium {
    function mint(address to, uint256 amount) external;
}

/**
 * @author Ali Nasirlou
 * @title WakandaStaking
 * @notice Governance token staking (AVNG) with Synthetix-based Vibranium (VBR) yield rewards.
 * @dev Core math scales token mechanics by 1e18 to bypass Solidity's lack of floating-point precision.
 */
contract WakandaStaking is ReentrancyGuard, AccessControl, Pausable {
    // ----------------------------------------------------------------------
    // Constants & Roles
    // ----------------------------------------------------------------------
    bytes32 public constant WAKANDA_KING_ROLE = keccak256("WAKANDA_KING_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /// @dev Crucial scalar to eliminate mathematical truncation during reward distribution divisions
    uint256 private constant PRECISION = 1e18;

    // ----------------------------------------------------------------------
    // Custom Errors
    // ----------------------------------------------------------------------
    error ZeroAddress();
    error InvalidAmount();
    error InsufficientBalance();
    error TransferFailed();
    error LockPeriodNotPassed();

    // ----------------------------------------------------------------------
    // State Variables
    // ----------------------------------------------------------------------
    IERC20 public immutable STAKING_TOKEN;
    IERC20 public immutable REWARD_TOKEN;

    uint256 public rewardRate;
    uint256 public totalStaked;
    uint256 public rewardPerTokenStored;
    uint256 public lastUpdateTime;

    struct Staker {
        uint256 amountStaked;
        uint256 rewardEarned;
        uint256 rewardPerTokenPaid; // Tracks the global index snapshot to compute precise user deltas
        uint256 lastStakeTimestamp;
    }

    mapping(address => Staker) public stakers;

    // ----------------------------------------------------------------------
    // Events
    // ----------------------------------------------------------------------
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);
    event RewardRateUpdated(uint256 oldRate, uint256 newRate);

    // ----------------------------------------------------------------------
    // Constructor
    // ----------------------------------------------------------------------
    constructor(
        address _stakingToken,
        address _rewardToken,
        uint256 _rewardRate,
        address _kingAdmin
    ) {
        if (_stakingToken == address(0) || _rewardToken == address(0) || _kingAdmin == address(0)) {
            revert ZeroAddress();
        }

        STAKING_TOKEN = IERC20(_stakingToken);
        REWARD_TOKEN = IERC20(_rewardToken);
        rewardRate = _rewardRate;
        lastUpdateTime = block.timestamp;

        _grantRole(DEFAULT_ADMIN_ROLE, _kingAdmin);
        _grantRole(WAKANDA_KING_ROLE, _kingAdmin);
        _grantRole(PAUSER_ROLE, _kingAdmin);
    }

    // ----------------------------------------------------------------------
    // Modifiers & Internal Math
    // ----------------------------------------------------------------------

    /**
     * @dev Optimized Modifier: Wraps logic into an internal function
     * to significantly reduce deployment code size and prevent compiler bloat.
     */
    modifier updateReward(address account) {
        _updateReward(account);
        _;
    }

    function _updateReward(address account) internal {
        rewardPerTokenStored = currentRewardPerToken();
        lastUpdateTime = block.timestamp;

        if (account != address(0)) {
            Staker storage user = stakers[account];
            user.rewardEarned = _earned(account);
            user.rewardPerTokenPaid = rewardPerTokenStored;
        }
    }

    /// @dev Calculates delta accruals based on user's relative pool share since their last interaction
    function _earned(address account) internal view returns (uint256) {
        Staker storage user = stakers[account];
        uint256 rewardPerTokenDelta = currentRewardPerToken() - user.rewardPerTokenPaid;
        return user.rewardEarned + (user.amountStaked * rewardPerTokenDelta) / PRECISION;
    }

    // ----------------------------------------------------------------------
    // Mutative Functions (External)
    // ----------------------------------------------------------------------
    function stake(uint256 amount) external nonReentrant whenNotPaused updateReward(msg.sender) {
        if (amount == 0) {
            revert InvalidAmount();
        }

        stakers[msg.sender].amountStaked += amount;
        stakers[msg.sender].lastStakeTimestamp = block.timestamp;
        totalStaked += amount;

        bool success = STAKING_TOKEN.transferFrom(msg.sender, address(this), amount);
        if (!success) {
            revert TransferFailed();
        }

        emit Staked(msg.sender, amount);
    }

    /**
     * @dev AUDIT NOTE: Intentionally omits 'whenNotPaused' modifier.
     * Users must ALWAYS be capable of rescuing their principal capital, even during emergency pauses.
     */
    function withdraw(uint256 amount) external nonReentrant updateReward(msg.sender) {
        if (amount == 0) {
            revert InvalidAmount();
        }
        if (amount > stakers[msg.sender].amountStaked) {
            revert InsufficientBalance();
        }

        if (block.timestamp < stakers[msg.sender].lastStakeTimestamp + 24 hours) {
            revert LockPeriodNotPassed();
        }

        stakers[msg.sender].amountStaked -= amount;
        totalStaked -= amount;

        bool success = STAKING_TOKEN.transfer(msg.sender, amount);
        if (!success) {
            revert TransferFailed();
        }

        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @dev CEI Pattern Compliance: Mutates storage indices (zeros rewardCounter) BEFORE triggering external mints.
     * Prevents malicious reentrancy vectors.
     */
    function claimReward() external nonReentrant updateReward(msg.sender) {
        uint256 reward = stakers[msg.sender].rewardEarned;

        if (reward > 0) {
            stakers[msg.sender].rewardEarned = 0;
            IVibranium(address(REWARD_TOKEN)).mint(msg.sender, reward);
            emit RewardClaimed(msg.sender, reward);
        }
    }

    // ----------------------------------------------------------------------
    // Admin Functions
    // ----------------------------------------------------------------------

    /**
     * @dev Employs updateReward(address(0)) to dynamically update and freeze historical metrics
     * under the old emission velocity before deploying the new rate.
     */
    function setRewardRate(uint256 _newRate)
        external
        onlyRole(WAKANDA_KING_ROLE)
        updateReward(address(0))
    {
        uint256 oldRate = rewardRate;
        rewardRate = _newRate;
        emit RewardRateUpdated(oldRate, _newRate);
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // ----------------------------------------------------------------------
    // View Functions
    // ----------------------------------------------------------------------

    /**
     * @notice Live global index tracking total rewards generated per individual staked token.
     * @dev Safeguards division logic from throwing 'Division by Zero' exceptions if the pool is empty.
     */
    function currentRewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) {
            return rewardPerTokenStored;
        }
        uint256 timeElapsed = block.timestamp - lastUpdateTime;
        return rewardPerTokenStored + (timeElapsed * rewardRate * PRECISION) / totalStaked;
    }

    function earned(address account) external view returns (uint256) {
        return _earned(account);
    }
}
