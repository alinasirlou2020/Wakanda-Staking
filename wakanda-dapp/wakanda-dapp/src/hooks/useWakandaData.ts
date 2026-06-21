import { useAccount, useReadContract, useReadContracts } from "wagmi";
import {
  AVENGERS_TOKEN_ABI,
  VIBRANIUM_TOKEN_ABI,
  WAKANDA_STAKING_ABI,
  CONTRACTS,
} from "../config/contracts";

/**
 * این هوک تمام داده‌های لازم برای داشبورد را در یک‌جا و با حداقل تعداد درخواست
 * (با استفاده از useReadContracts که چند فراخوانی را در یک batch انجام می‌دهد) برمی‌گرداند.
 *
 * توجه: تابع `stakers` در قرارداد استیکینگ یک فیلد lastStakeTimestamp دارد که برای
 * قابلیت قفل زمانی (lock period) استفاده می‌شود - این مقدار را هم می‌خوانیم تا
 * در رابط کاربری زمان باقی‌مانده تا امکان withdraw را نشان بدهیم.
 */
export function useWakandaData() {
  const { address, isConnected } = useAccount();

  const { data, isLoading, isError, refetch } = useReadContracts({
    contracts: [
      {
        address: CONTRACTS.AVENGERS_TOKEN,
        abi: AVENGERS_TOKEN_ABI,
        functionName: "balanceOf",
        args: [address ?? "0x0000000000000000000000000000000000000000"],
      },
      {
        address: CONTRACTS.VIBRANIUM_TOKEN,
        abi: VIBRANIUM_TOKEN_ABI,
        functionName: "balanceOf",
        args: [address ?? "0x0000000000000000000000000000000000000000"],
      },
      {
        address: CONTRACTS.WAKANDA_STAKING,
        abi: WAKANDA_STAKING_ABI,
        functionName: "stakers",
        args: [address ?? "0x0000000000000000000000000000000000000000"],
      },
      {
        address: CONTRACTS.WAKANDA_STAKING,
        abi: WAKANDA_STAKING_ABI,
        functionName: "earned",
        args: [address ?? "0x0000000000000000000000000000000000000000"],
      },
      {
        address: CONTRACTS.AVENGERS_TOKEN,
        abi: AVENGERS_TOKEN_ABI,
        functionName: "allowance",
        args: [
          address ?? "0x0000000000000000000000000000000000000000",
          CONTRACTS.WAKANDA_STAKING,
        ],
      },
      {
        address: CONTRACTS.WAKANDA_STAKING,
        abi: WAKANDA_STAKING_ABI,
        functionName: "paused",
      },
    ],
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 15_000, // هر ۱۵ ثانیه خودکار رفرش می‌شود
    },
  });

  const stakerInfo = data?.[2]?.result as
    | readonly [bigint, bigint, bigint, bigint]
    | undefined;

  return {
    avngBalance: (data?.[0]?.result as bigint) ?? 0n,
    vbrBalance: (data?.[1]?.result as bigint) ?? 0n,
    amountStaked: stakerInfo?.[0] ?? 0n,
    lastStakeTimestamp: stakerInfo?.[3] ?? 0n,
    earnedRewards: (data?.[3]?.result as bigint) ?? 0n,
    allowance: (data?.[4]?.result as bigint) ?? 0n,
    isStakingPaused: (data?.[5]?.result as boolean) ?? false,
    isLoading,
    isError,
    refetch,
  };
}

/**
 * هوک ساده برای خوانش totalStaked کل استخر (برای نمایش آمار کلی پروژه - اختیاری)
 */
export function useTotalStaked() {
  return useReadContract({
    address: CONTRACTS.WAKANDA_STAKING,
    abi: WAKANDA_STAKING_ABI,
    functionName: "totalStaked",
    query: { refetchInterval: 15_000 },
  });
}
