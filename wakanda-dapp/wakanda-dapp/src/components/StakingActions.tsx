import { useState } from "react";
import { parseUnits, formatUnits } from "viem";
import { useAccount } from "wagmi";
import { useWakandaData } from "../hooks/useWakandaData";
import { useWakandaActions } from "../hooks/useWakandaActions";

type Tab = "stake" | "withdraw";

export function StakingActions() {
  const { isConnected } = useAccount();
  const { avngBalance, amountStaked, earnedRewards, isStakingPaused, refetch } =
    useWakandaData();
  const {
    stake,
    withdraw,
    claimReward,
    step,
    isBusy,
    errorMessage,
    resetError,
  } = useWakandaActions(() => refetch());

  const [tab, setTab] = useState<Tab>("stake");
  const [amountInput, setAmountInput] = useState("");

  const maxAmount = tab === "stake" ? avngBalance : amountStaked;

  const handleMax = () => {
    setAmountInput(formatUnits(maxAmount, 18));
  };

  const handleSubmit = async () => {
    if (!amountInput || Number(amountInput) <= 0) return;
    resetError();

    let amountWei: bigint;
    try {
      amountWei = parseUnits(amountInput, 18);
    } catch {
      return;
    }

    if (tab === "stake") {
      await stake(amountWei);
    } else {
      await withdraw(amountWei);
    }
    setAmountInput("");
  };

  if (!isConnected) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-[#110d24] p-10 text-center shadow-2xl dir-ltr">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-between rounded-xl bg-purple-500/10 p-3 text-purple-400 border border-purple-500/20">
          <svg
            className="h-6 w-6 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-300">
          Please connect your wallet to start staking or withdrawing assets.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-purple-500/20 bg-[#110d24] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-xl mx-auto w-full text-left"
      style={{ direction: "ltr" }}
    >
      {/* Action Tabs */}
      <div className="mb-6 flex gap-2 rounded-xl bg-[#090615] p-1.5 border border-white/5">
        <TabButton
          active={tab === "stake"}
          onClick={() => {
            setTab("stake");
            resetError();
          }}
        >
          ⚡ Stake Assets
        </TabButton>
        <TabButton
          active={tab === "withdraw"}
          onClick={() => {
            setTab("withdraw");
            resetError();
          }}
        >
          📥 Withdraw
        </TabButton>
      </div>

      {tab === "stake" && isStakingPaused && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-300 flex items-center gap-2 animate-pulse">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span>Staking is currently paused by the contract owner.</span>
        </div>
      )}

      {/* Amount Input */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-gray-400">
          <span>
            {tab === "stake" ? "Amount to Stake" : "Amount to Withdraw"}
          </span>
          <span className="font-mono">
            Available:{" "}
            {Number(formatUnits(maxAmount, 18)).toLocaleString(undefined, {
              maximumFractionDigits: 4,
            })}{" "}
            AVNG
          </span>
        </div>

        <div className="relative flex items-center">
          <input
            type="number"
            min="0"
            step="any"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            placeholder="0.0"
            className="w-full rounded-xl border border-white/10 bg-[#090615] pr-20 pl-4 py-3.5 text-white font-mono text-lg outline-none transition focus:border-purple-500/50 focus:shadow-[0_0_15px_rgba(147,51,234,0.1)] text-left"
          />
          <button
            onClick={handleMax}
            className="absolute right-3 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-400 transition hover:bg-purple-500/20 active:scale-95"
          >
            MAX
          </button>
        </div>
      </div>

      {/* Main Action Button */}
      <button
        onClick={handleSubmit}
        disabled={
          isBusy || !amountInput || (tab === "stake" && isStakingPaused)
        }
        className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-cyan-600 py-3.5 font-bold text-white transition-all duration-300 shadow-[0_4px_20px_rgba(147,51,234,0.3)] hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none"
      >
        {isBusy ? (
          <div className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{getButtonLabel(step, tab)}</span>
          </div>
        ) : (
          getButtonLabel(step, tab)
        )}
      </button>

      {errorMessage && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-400 font-medium">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Reward Section */}
      <div className="mt-6 border-t border-white/10 pt-5">
        <div className="mb-4 flex items-center justify-between rounded-xl bg-[#090615] p-3 border border-white/5">
          <span className="text-xs font-bold text-gray-400">
            Claimable Vibranium Reward
          </span>
          <span className="font-mono font-black text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            {Number(formatUnits(earnedRewards, 18)).toLocaleString(undefined, {
              maximumFractionDigits: 6,
            })}{" "}
            VBR
          </span>
        </div>

        <button
          onClick={() => claimReward()}
          disabled={isBusy || earnedRewards === 0n}
          className="w-full rounded-xl border border-amber-500/30 bg-amber-500/5 py-3 font-bold text-amber-400 transition-all duration-300 hover:bg-amber-500/10 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-20 shadow-sm"
        >
          {step === "claiming" ? (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Claiming Rewards...</span>
            </div>
          ) : (
            "🏆 Claim Wakanda Reward"
          )}
        </button>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-all duration-300 ${
        active
          ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-[0_2px_15px_rgba(147,51,234,0.3)]"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {children}
    </button>
  );
}

function getButtonLabel(step: string, tab: Tab): string {
  if (step === "approving") return "Approving Allowance...";
  if (step === "staking") return "Staking in Progress...";
  if (step === "withdrawing") return "Withdrawing in Progress...";
  return tab === "stake" ? "Confirm & Stake" : "Confirm & Withdraw";
}
