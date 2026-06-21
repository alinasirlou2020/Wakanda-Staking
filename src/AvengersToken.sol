// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import { ERC20Pausable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import { ERC20Votes } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import { ERC20Permit } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import { Nonces } from "@openzeppelin/contracts/utils/Nonces.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @author Ali Nasirlou
 * @title AvengersToken (AVNG)
 * @notice Governance token for the ecosystem - utilized for voting, staking in Wakanda pools, and ecosystem access.
 * @dev Built on top of OpenZeppelin ERC20 extensions. Hard-capped supply with no post-deployment minting capabilities.
 */
contract AvengersToken is
    ERC20,
    ERC20Burnable,
    ERC20Pausable,
    ERC20Permit,
    ERC20Votes,
    AccessControl
{
    // ----------------------------------------------------------------------
    // Roles
    // ----------------------------------------------------------------------

    /// @notice Role authorized to pause and unpause token transfers in emergencies
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // ----------------------------------------------------------------------
    // Constants
    // ----------------------------------------------------------------------

    /// @notice Hard-capped maximum supply of the token (100 Million AVNG)
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** 18;

    /// @notice Initial supply minted to the treasury account upon deployment (40 Million AVNG)
    uint256 public constant INITIAL_MINT = 40_000_000 * 10 ** 18;

    // ----------------------------------------------------------------------
    // Constructor
    // ----------------------------------------------------------------------

    /**
     * @param treasury The address where the initial supply will be minted (Ecosystem Treasury)
     * @param admin The address granted administrative privileges and emergency control roles
     */
    constructor(address treasury, address admin) ERC20("Avengers", "AVNG") ERC20Permit("Avengers") {
        require(treasury != address(0), "treasury zero address");
        require(admin != address(0), "admin zero address");

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);

        // Initial mint - The only place where token minting occurs
        _mint(treasury, INITIAL_MINT);
    }

    // ----------------------------------------------------------------------
    // Administrative Operations
    // ----------------------------------------------------------------------

    /**
     * @notice Pauses all token transfers
     * @dev Only callable by accounts holding the PAUSER_ROLE
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @notice Unpauses token transfers, restoring normal operations
     * @dev Only callable by accounts holding the PAUSER_ROLE
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // ----------------------------------------------------------------------
    // Required Overrides
    // ----------------------------------------------------------------------

    /**
     * @dev Hook that is called after any transfer of tokens. Melds ERC20Pausable and ERC20Votes logic.
     */
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable, ERC20Votes)
    {
        super._update(from, to, value);
    }

    /**
     * @dev Overrides nonces to resolve collision between ERC20Permit and ERC20Votes (via Nonces)
     */
    function nonces(address owner) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}
