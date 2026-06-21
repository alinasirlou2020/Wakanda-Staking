import AvengersTokenAbi from "../abi/AvengersToken.json";
import VibraniumTokenAbi from "../abi/VibraniumToken.json";
import WakandaStakingAbi from "../abi/WakandaStaking.json";

/**
 * آدرس‌های قراردادها روی شبکه‌ی Polygon Amoy Testnet (Chain ID: 80002)
 */
export const CONTRACTS = {
  AVENGERS_TOKEN: "0xe3223D5100499C10fa3A2a3a0126619Dd6274723" as const,
  VIBRANIUM_TOKEN: "0x9234adD6E88fb1450B2f6bFa5B2A61e1f132a02f" as const,
  WAKANDA_STAKING: "0x102Acd8afA6EA1Ae4995Ae14fFDc4e40228a5210" as const,
};

export const AVENGERS_TOKEN_ABI = AvengersTokenAbi;
export const VIBRANIUM_TOKEN_ABI = VibraniumTokenAbi;
export const WAKANDA_STAKING_ABI = WakandaStakingAbi;

export const CHAIN_ID = 80002;
