// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Test } from "forge-std/Test.sol";
import { WakandaStaking } from "../src/WakandaStaking.sol";
import { VibraniumToken } from "../src/VibraniumToken.sol";
import { AvengersToken } from "../src/AvengersToken.sol";

/**
 * @author Ali Nasirlou
 * @title WakandaStaking Test Suite
 * @notice Validates ecosystem flow utilizing the production AvengersToken (AVNG).
 */
contract WakandaStakingTest is Test {
    WakandaStaking public staking;
    VibraniumToken public vbr;
    AvengersToken public avng;

    // Infrastructure actors
    address public admin = address(1);
    address public user = address(2);
    address public treasury = address(3);

    // Staking parameters
    uint256 public constant REWARD_RATE = 10 * 1e18; // 10 VBR per second

    function setUp() public {
        vm.startPrank(admin);

        // 1. Deploy production Avengers Governance Token (AVNG)
        // Treasury receives initial mint (40M tokens)
        avng = new AvengersToken(treasury, admin);

        // 2. Deploy Vibranium Reward Token (VBR)
        vbr = new VibraniumToken(admin);

        // 3. Deploy Staking Vault linked to production tokens
        staking = new WakandaStaking(address(avng), address(vbr), REWARD_RATE, admin);

        // 4. Authorize staking engine to mint reward allocations
        vbr.grantRole(vbr.MINTER_ROLE(), address(staking));

        vm.stopPrank();

        // 5. Fund the test user with AVNG tokens from the Treasury account
        vm.prank(treasury);
        avng.transfer(user, 1000 * 1e18);
    }

    /**
     * @notice Verifies successful staking cycle updates user storage balances correctly.
     */
    function test_StakeSuccessful() public {
        uint256 stakeAmount = 500 * 1e18;

        vm.startPrank(user);

        // Approve vault to transfer tokens out of user wallet
        avng.approve(address(staking), stakeAmount);
        staking.stake(stakeAmount);

        vm.stopPrank();

        // Assert global pool and user state changes
        assertEq(staking.totalStaked(), stakeAmount);

        (uint256 amountStaked,,,) = staking.stakers(user);
        assertEq(amountStaked, stakeAmount);

        // Confirm wallet balances decremented properly
        assertEq(avng.balanceOf(user), 500 * 1e18);
    }

    /**
     * @notice Validates mathematical time-dilation accumulation logic.
     */
    function test_RewardAccumulationOverTime() public {
        uint256 stakeAmount = 500 * 1e18;

        vm.startPrank(user);
        avng.approve(address(staking), stakeAmount);
        staking.stake(stakeAmount);
        vm.stopPrank();

        // Simulate 10 seconds passing inside the EVM state block
        vm.warp(block.timestamp + 10);

        // 10 seconds * 10 tokens/sec = 100 reward tokens expected
        uint256 expectedReward = 10 * REWARD_RATE;
        uint256 actualReward = staking.earned(user);

        assertEq(actualReward, expectedReward);
    }

    /**
     * @notice Assures zeroing ledger and minting actions upon claim routine executions.
     */
    function test_ClaimRewardMintsVBR() public {
        uint256 stakeAmount = 100 * 1e18;

        vm.startPrank(user);
        avng.approve(address(staking), stakeAmount);
        staking.stake(stakeAmount);

        // Warp 5 seconds forward (5s * 10 tokens/sec = 50 rewards)
        vm.warp(block.timestamp + 5);

        staking.claimReward();
        vm.stopPrank();

        // Ensure user wallet received exactly 50 minted VBR tokens
        assertEq(vbr.balanceOf(user), 50 * 1e18);

        // Assert internal staking record reward tracking is reset to 0
        assertEq(staking.earned(user), 0);
    }

    /**
     * @notice Enforces 24-hour liquidity lockup window checks on early withdrawals.
     */
    function test_WithdrawFailsBeforeLockPeriod() public {
        uint256 stakeAmount = 100 * 1e18;

        vm.startPrank(user);
        avng.approve(address(staking), stakeAmount);
        staking.stake(stakeAmount);

        // Fast-forward only 1 hour (violating the 24-hour security window)
        vm.warp(block.timestamp + 1 hours);

        // Expect transaction rollback enforcing custom error rule
        vm.expectRevert(WakandaStaking.LockPeriodNotPassed.selector);
        staking.withdraw(stakeAmount);

        vm.stopPrank();
    }
}
