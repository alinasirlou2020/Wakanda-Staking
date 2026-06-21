// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import { ERC20Pausable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @author Ali Nasirlou
 * @title VibraniumToken (VBR)
 * @notice In-game utility resource token minted exclusively by authorized yield/staking systems.
 * @dev Infinite max supply with burns triggered during item crafting or character upgrades.
 */
contract VibraniumToken is ERC20, ERC20Burnable, ERC20Pausable, AccessControl {
    // ----------------------------------------------------------------------
    // Constants & Roles
    // ----------------------------------------------------------------------
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // ----------------------------------------------------------------------
    // Custom Errors
    // ----------------------------------------------------------------------
    error ZeroAddress();

    // ----------------------------------------------------------------------
    // Constructor
    // ----------------------------------------------------------------------
    constructor(address admin) ERC20("Vibranium", "VBR") {
        if (admin == address(0)) {
            revert ZeroAddress();
        }

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);

        // NOTE: MINTER_ROLE is left unassigned during initialization.
        // Must be explicitly granted to the WakandaStaking contract address post-deployment.
    }

    // ----------------------------------------------------------------------
    // Mutative Functions (External)
    // ----------------------------------------------------------------------

    /**
     * @notice Mints a designated volume of VBR to a recipient address.
     * @dev Hooked dynamically into the lifecycle of authorized minting systems.
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    // ----------------------------------------------------------------------
    // Admin Functions
    // ----------------------------------------------------------------------

    /**
     * @notice Freezes all basic token routing layers and new minting operations.
     * @dev AUDIT NOTE: Deliberately halts token generation during black-swan security events.
     * Consequently, 'claimReward()' inside the staking engine will temporarily revert until unpaused.
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // ----------------------------------------------------------------------
    // Internal Overrides
    // ----------------------------------------------------------------------

    /**
     * @dev Compulsory internal routing overlay required to bridge OpenZeppelin base state updates.
     */
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}
