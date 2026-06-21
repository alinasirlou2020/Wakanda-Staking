import { useState, useCallback } from "react";
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useConfig,
} from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import {
  AVENGERS_TOKEN_ABI,
  WAKANDA_STAKING_ABI,
  CONTRACTS,
} from "../config/contracts";

type ActionStep = "idle" | "approving" | "staking" | "withdrawing" | "claiming";

export function useWakandaActions(onSuccess?: () => void) {
  const { address } = useAccount();
  const config = useConfig();
  const [step, setStep] = useState<ActionStep>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { writeContractAsync } = useWriteContract();

  const waitForReceipt = useCallback(
    (hash: `0x${string}`) => waitForTransactionReceipt(config, { hash }),
    [config],
  );

  const { refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.AVENGERS_TOKEN,
    abi: AVENGERS_TOKEN_ABI,
    functionName: "allowance",
    args: [
      address ?? "0x0000000000000000000000000000000000000000",
      CONTRACTS.WAKANDA_STAKING,
    ],
    query: { enabled: false },
  });

  const resetError = useCallback(() => setErrorMessage(null), []);

  const stake = useCallback(
    async (amountWei: bigint) => {
      if (!address) {
        setErrorMessage("لطفاً اول کیف‌پول را وصل کن");
        return;
      }
      resetError();

      try {
        const refetchResult = await refetchAllowance();
        const allowance = (refetchResult.data as bigint) ?? 0n;

        if (allowance < amountWei) {
          setStep("approving");
          const approveHash = await writeContractAsync({
            address: CONTRACTS.AVENGERS_TOKEN,
            abi: AVENGERS_TOKEN_ABI,
            functionName: "approve",
            args: [CONTRACTS.WAKANDA_STAKING, amountWei],
          });
          await waitForReceipt(approveHash);
        }

        setStep("staking");
        const stakeHash = await writeContractAsync({
          address: CONTRACTS.WAKANDA_STAKING,
          abi: WAKANDA_STAKING_ABI,
          functionName: "stake",
          args: [amountWei],
        });
        await waitForReceipt(stakeHash);

        setStep("idle");
        onSuccess?.();
      } catch (err) {
        setStep("idle");
        setErrorMessage(parseContractError(err));
      }
    },
    [
      address,
      writeContractAsync,
      refetchAllowance,
      waitForReceipt,
      resetError,
      onSuccess,
    ],
  );

  const withdraw = useCallback(
    async (amountWei: bigint) => {
      resetError();
      try {
        setStep("withdrawing");
        const hash = await writeContractAsync({
          address: CONTRACTS.WAKANDA_STAKING,
          abi: WAKANDA_STAKING_ABI,
          functionName: "withdraw",
          args: [amountWei],
        });
        await waitForReceipt(hash);
        setStep("idle");
        onSuccess?.();
      } catch (err) {
        setStep("idle");
        setErrorMessage(parseContractError(err));
      }
    },
    [writeContractAsync, waitForReceipt, resetError, onSuccess],
  );

  const claimReward = useCallback(async () => {
    resetError();
    try {
      setStep("claiming");
      const hash = await writeContractAsync({
        address: CONTRACTS.WAKANDA_STAKING,
        abi: WAKANDA_STAKING_ABI,
        functionName: "claimReward",
      });
      await waitForReceipt(hash);
      setStep("idle");
      onSuccess?.();
    } catch (err) {
      setStep("idle");
      setErrorMessage(parseContractError(err));
    }
  }, [writeContractAsync, waitForReceipt, resetError, onSuccess]);

  return {
    stake,
    withdraw,
    claimReward,
    step,
    isBusy: step !== "idle",
    errorMessage,
    resetError,
  };
}

export function parseContractError(err: unknown): string {
  const message = (err as Error)?.message || "";

  if (message.includes("InvalidAmount")) return "مقدار وارد شده نامعتبر است";
  if (message.includes("InsufficientBalance")) return "موجودی کافی نیست";
  if (message.includes("LockPeriodNotPassed"))
    return "هنوز دوره‌ی قفل برداشت به پایان نرسیده است";
  if (message.includes("EnforcedPause"))
    return "قرارداد در حال حاضر متوقف شده است";
  if (message.includes("TransferFailed")) return "انتقال توکن با خطا مواجه شد";
  if (message.includes("User rejected") || message.includes("user rejected"))
    return "تراکنش توسط شما لغو شد";
  if (message.includes("AccessControlUnauthorizedAccount"))
    return "این آدرس دسترسی لازم برای این عملیات را ندارد";

  return "خطایی رخ داد - جزئیات بیشتر را در کنسول مرورگر ببین";
}
