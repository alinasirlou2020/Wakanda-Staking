// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Script, console2 } from "forge-std/Script.sol";
import { AvengersToken } from "../src/AvengersToken.sol";
import { VibraniumToken } from "../src/VibraniumToken.sol";
import { WakandaStaking } from "../src/WakandaStaking.sol";

/**
 * @author Ali Nasirlou
 * @title DeployAll Staking Ecosystem Script
 * @notice Orchestrates the sequential deployment, address coupling, and
 * privilege initialization for the entire Avengers/Wakanda DeFi ecosystem.
 */
contract DeployAll is Script {
    function run() external {
        // Fetch private key from environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);

        console2.log("=== Starting Ecosystem Deployment ===");
        console2.log("Deployer Address:", deployerAddress);

        // Broadcast triggers real on-chain transactions via the EVM
        vm.startBroadcast(deployerPrivateKey);

        // ----------------------------------------------------------------------
        // 1. Deploy Avengers Token (AVNG)
        // ----------------------------------------------------------------------
        // We set deployerAddress as both Treasury (to receive INITIAL_MINT) and Admin
        AvengersToken avng = new AvengersToken(deployerAddress, deployerAddress);
        console2.log("[1/3] AvengersToken (AVNG) Deployed at:", address(avng));

        // ----------------------------------------------------------------------
        // 2. Deploy Vibranium Token (VBR)
        // ----------------------------------------------------------------------
        VibraniumToken vbr = new VibraniumToken(deployerAddress);
        console2.log("[2/3] VibraniumToken (VBR) Deployed at:", address(vbr));

        // ----------------------------------------------------------------------
        // 3. Deploy WakandaStaking Engine
        // ----------------------------------------------------------------------
        // Dynamic Address Coupling: We pass the freshly generated token addresses directly
        uint256 rewardRate = 10 * 1e18; // 10 VBR tokens minted per second globally

        WakandaStaking staking =
            new WakandaStaking(address(avng), address(vbr), rewardRate, deployerAddress);
        console2.log("[3/3] WakandaStaking Engine Deployed at:", address(staking));

        // ----------------------------------------------------------------------
        // 4. Trust Matrix Initialization (Role Granting)
        // ----------------------------------------------------------------------
        // Authorize the WakandaStaking contract to dynamically mint VBR tokens
        vbr.grantRole(vbr.MINTER_ROLE(), address(staking));
        console2.log("Access Control Linked: MINTER_ROLE granted to WakandaStaking.");

        vm.stopBroadcast();
        console2.log("=== Ecosystem Deployment Successfully Finalized ===");
    }
}
