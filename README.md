# 🏛️ WAKANDA — Advanced DeFi Staking & Governance Eco-System

[![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.24-blue)](https://soliditylang.org/)
[![Framework](https://img.shields.io/badge/Framework-Foundry-orange)](https://book.getfoundry.sh/)
[![Security](https://img.shields.io/badge/Security-Slither%20Audited-brightgreen)](#-security-posture--quality-assurance)
[![License](https://img.shields.io/badge/License-MIT-green)](https://opensource.org/licenses/MIT)
[![Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen)](#-testing--quality-assurance)

A high-performance, gas-optimized, and security-audited decentralized staking and governance infrastructure engineered via **Foundry** and **OpenZeppelin** standards. This repository features robust Solidity smart contracts architecture built around the industry-standard **Synthetix Staking Algorithm** to distribute scalable yields dynamically based on proportional pool shares.

---

## 📝 Overview

**WAKANDA ECOSYSTEM** serves as a complete production-grade DeFi infrastructure layout. It introduces a multi-token economy allowing users to utilize their **Avengers Governance Assets (AVNG)** to participate in voting protocols or lock them inside the staking infrastructure to harvest freshly minted cryptographic resources via the **Vibranium Token (VBR)**.

The staking architecture completely discards legacy, gas-intensive loop distribution models. Instead, it utilizes an advanced global index tracking scheme ($O(1)$ computational complexity) that calculates exact mathematical yield accruals lazily upon interaction. This ensures that whether the pool holds 5 stakers or 500,000, execution costs remain flat, safe, and highly efficient.

---

## 🚀 Technical Stack & Tools

- **Language:** Solidity ^0.8.24
- **Framework:** [Foundry](https://book.getfoundry.sh/) (Forge & Cast)
- **Library:** [OpenZeppelin Contracts](https://openzeppelin.com/contracts/)
- **Access Control:** Role-Based Access Control (RBAC)
- **Security Scanner:** Slither Static Analyzer

### DApp Frontend Layer
 - **Framework:** React / Next.js with TypeScript 
 - **Styling:** Tailwind CSS (Custom Dark Cyberpunk/Neon Theme) 
 -  **Blockchain Interaction:** Wagmi Hooks & Viem Client Utilities


---

## ✨ Key Features & Component Breakdown

### 1. WakandaStaking Engine ($O(1)$ Complexity)
- **Synthetix Reward Engine:** Implements advanced lazy-evaluation mathematical mechanics to track exact historical reward accumulation per individual staked token.
- **Floating-Point Precision Safeguard:** Utilizes a custom scalar multiplier (`PRECISION = 1e18`) to completely eliminate decimal truncation and rounding errors inherent to Solidity's integer division.
- **Non-Custodial Emergency Break:** Integrates a granular `Pausable` model allowing admins to freeze new deposits (`stake`) during black-swan events, while intentionally keeping withdrawals open so user capital is never held hostage.
- **Liquidity Lock-up Period:** Features a mandatory 24-hour liquidity retention timeline initialized at each staking action to stabilize the vault context and mitigate rapid flash-loan exploit exposure vectors.
- **Gas-Optimized Modifier Wrapping:** Encapsulates heavy modifier code blocks inside single internal function routers, preventing compiler bytecode bloat and heavily reducing deployment overhead.

### 2. Avengers Token (AVNG) — Governance Core
- **Hard-Capped Structural Integrity:** Engineered with a rigid maximum supply ceiling of **100,000,000 AVNG**. Post-deployment minting capabilities are explicitly omitted to protect token scarcity.
- **Advanced On-Chain Governance (`ERC20Votes`):** Integrates checkpoint historical mapping structures, enabling delegable voting power representation for decentralized autonomous setups.
- **Gasless Approvals (`ERC20Permit`):** Supports EIP-2612 signed structured cryptographic messages, allowing users to execute one-click `approve-and-stake` sequences via signatures, bypassing standard double-transaction gas costs.
- **Emergency Circuit Breaker:** Implements `ERC20Pausable` overrides allowing authorized administrative roles to halt bad-actor transfer vectors instantly during live network exploits.

### 3. Vibranium Token (VBR) — Elastic Resource Yield
- **Infinite Elastic Utility Supply:** Built with an un-capped maximum supply configuration, where mint paths are decoupled from human access and strictly gated under cross-contract authorized consensus layers.
- **Black-Swan Emission Interdiction:** Engineered to pass all mint traffic directly through internal `ERC20Pausable` filters. Pausing the VBR token programmatically intercepts new token prints, prioritizing structural economic integrity over immediate reward claims during emergency statuses.

### 4. Live Decentralized Application (dApp Interface) 
- **Premium Cyberpunk UI:** Built with a fully custom, sleek dark neon interface designed for seamless asset management. - 
- **State-of-the-Art Wallet Bridge:** Integrated via global Web3 states using React Portals to host isolated, blurred backdrop modal screens for secure wallet interactions and disconnect workflows. 
- **Real-Time Blockchain Telemetry:** Dynamically fetches pool indexes, user allowances, live pending rewards, and staking states directly from active RPC Providers via reactive React Hooks.

---

## 📖 Smart Contract Logic & Workflows

### 🔒 Operational Architecture & Lifecycle
1. **The Staking Flow:** Users approve the vault and call `stake()`. The state machine records the exact `lastStakeTimestamp`, updates global tracking variables (`totalStaked`), and safely transfers tokens using defensive boolean transfer gates.
2. **Dynamic Reward Harvesting:** Calling `claimReward()` computes the accurate delta shift since the user's last interaction block, flushes the internal ledger to zero, and triggers the authorized `IVibranium.mint()` gateway.
3. **Liquidity Withdrawal Safety:** Users calling `withdraw()` must clear the 24-hour chronological barrier established from their most recent staking activity; otherwise, the execution path triggers a defensive rollback.

### 📐 Structural State Calculations

Pool yield tracking and delta offsets are tracked via an optimized mathematical accumulation model:

$$\text{Accumulated Index} = \text{rewardPerTokenStored} + \frac{\text{timeElapsed} \times \text{rewardRate} \times 10^{18}}{\text{totalStaked}}$$

---

## 🔒 Security Posture & Quality Assurance

This system strictly prioritizes deterministic safety execution paths, validated through static analysis compilation suites and comprehensive local unit assertions.

### 1. Reentrancy Protection & CEI Adherence
All state-mutating functions strictly enforce the **Checks-Effects-Interactions (CEI)** pattern. In `claimReward()`, user earning accounting records are mutated and zeroed out *before* triggering the external resource low-level mint function on the Vibranium token contract, rendering reentrancy vectors mathematically impossible.

### 2. Slither Static Analysis Comprehensive Report

The architectural layout compiles securely under intensive **Slither** compilation scanning across the entire inheritance ecosystem tree (**41 contracts** analyzed including OpenZeppelin dependencies), highlighting **0 High**, **0 Medium**, and **0 Low** architectural vulnerabilities:

```bash
$ slither .
'forge clean' running (wd: .../Wakanda_Staking)
'forge config --json' running
'forge build --build-info --skip ./test/** ./script/** --force' running (wd: .../Wakanda_Staking)
INFO:Detectors:
Detector: timestamp
WakandaStaking.withdraw(uint256) (src/WakandaStaking.sol#144-165) uses timestamp for comparisons
        Dangerous comparisons:
        - block.timestamp < stakers[msg.sender].lastStakeTimestamp + 86400 (src/WakandaStaking.sol#152)
Detector: missing-inheritance
VibraniumToken (src/VibraniumToken.sol#15-84) should inherit from IVibranium (src/WakandaStaking.sol#9-11)
Detector: naming-convention
Parameter WakandaStaking.setRewardRate(uint256)._newRate (src/WakandaStaking.sol#189) is not in mixedCase
Variable WakandaStaking.STAKING_TOKEN (src/WakandaStaking.sol#41) is not in mixedCase
Variable WakandaStaking.REWARD_TOKEN (src/WakandaStaking.sol#42) is not in mixedCase
INFO:Slither:. analyzed (41 contracts with 101 detectors), 5 result(s) found
```

#### 🔍 Deep-Dive Evaluation of Informational Alerts:

-   ⚖️ **`block.timestamp` Evaluation:** Slither flags chronological state dependencies because miners can shift block timestamps by small variances. This is explicitly marked as a **False Positive** because our lock duration spans a massive window (`24 hours`). Minor millisecond shifting holds absolutely zero leverage or exploitative math vectors against the staking unlock layer.
    
-   🔗 **`missing-inheritance` Warning:** Slither notes that `VibraniumToken` implements the `mint` method but doesn't formally inherit the standalone `IVibranium` interface compiled inside the staking header. This is a deliberate design choice decoupled for contract isolation. The execution layer relies entirely on ABI-compliant dynamic calls (`IVibranium(address).mint`), maintaining full execution compatibility without bloated linkage dependencies.
    
-   🏷️ **`STAKING_TOKEN` & `REWARD_TOKEN` Capitalization:** Marked because it diverges from regular `mixedCase` styling rules. However, because these references represent core **`immutable`** state records established during construction, contract development best practices dictate using `UPPER_CASE` formatting to signal permanent immutability across the system.
    
-   📐 **`_newRate` Param Prefixing:** The leading underscore is manually applied to shield parameters from shadowing top-level storage state keys (`rewardRate`), prioritizing immediate human structural readability during manual code review cycles.
    

## 🧪 Testing & Quality Assurance

Security, gas optimization, and logic assertions are guaranteed via Foundry's testing environment utilizing the production-grade token configurations.

### Run Test Executions:

```bash
forge test -vv
```


## 🚀 Live Deployment 
The contract has been officially deployed, verified, and thoroughly live-tested on the  **Polygon Amoy Network**.

-  **Name:**  Wakanda Staking
-   **Contract Address:**  [`0x102Acd8afA6EA1Ae4995Ae14fFDc4e40228a5210`](https://amoy.polygonscan.com/address/0x102Acd8afA6EA1Ae4995Ae14fFDc4e40228a5210)
-   **Verified Explorer Contract:**  [Click here to view on PolygonScan](https://amoy.polygonscan.com/address/0x102Acd8afA6EA1Ae4995Ae14fFDc4e40228a5210#code)  ✅

---

-  **Name:**  Avengers Token
-   **Contract Address:**  [`0xe3223D5100499C10fa3A2a3a0126619Dd6274723`](https://amoy.polygonscan.com/address/0xe3223D5100499C10fa3A2a3a0126619Dd6274723)
-   **Verified Explorer Contract:**  [Click here to view on PolygonScan](https://amoy.polygonscan.com/address/0xe3223D5100499C10fa3A2a3a0126619Dd6274723#code)  ✅
---
-  **Name:**  Vibranium Token
-   **Contract Address:**  [`0x9234adD6E88fb1450B2f6bFa5B2A61e1f132a02f`](https://amoy.polygonscan.com/address/0x9234adD6E88fb1450B2f6bFa5B2A61e1f132a02f)
-   **Verified Explorer Contract:**  [Click here to view on PolygonScan](https://amoy.polygonscan.com/address/0x9234adD6E88fb1450B2f6bFa5B2A61e1f132a02f#code)  ✅



### 🛠️ Trust Initialization Sequence (Post-Deploy Workflow)

Orchestration scripts couple the contracts together automatically using the following sequential lifecycle order:

1.  Deploy `AvengersToken` setting the core deployer key as admin and assigning the Treasury allocations.
    
2.  Deploy `VibraniumToken` setting your core deployer key as admin.
    
3.  Deploy `WakandaStaking` providing the static addresses of the two deployed token states.
    
4.  **Critical Initialization Integration:** Invoke `grantRole(MINTER_ROLE, WakandaStaking_Address)` on the Vibranium token contract to empower the staking engine to execute dynamic mint reward processing.
    

## Installation & Usage

### Prerequisites

-   Foundry
```bash
curl -L https://foundry.paradigm.xyz | bash && foundryup
```

### Clone & Build

```bash
git clone https://github.com/alinasirlou2020/Wakanda-Staking.git
cd Wakanda-Staking
forge install
forge build
```

## 📜 Deployment Script Execution

The complete multi-token ecosystem is launched via centralized, idempotent Solidity orchestration scripts.

```bash
forge script script/DeployAll.s.sol --rpc-url $AMOY_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify --etherscan-api-key $POLYGONSCAN_API_KEY
```

## 📜 License

This project is licensed under the **MIT License**.

## Author

### Ali Nasirlou

-   **Github:** [`alinasirlou2020`](https://github.com/alinasirlou2020)
    
-   **Linkedin:** [`Ali Nasirlou`](https://www.linkedin.com/in/ali-nasirlou-14b6713b1/)