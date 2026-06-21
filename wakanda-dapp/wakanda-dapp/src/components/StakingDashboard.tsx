import { formatUnits } from "viem";
import { useWakandaData } from "../hooks/useWakandaData";

function formatToken(value: bigint, decimalsToShow = 4): string {
  const formatted = formatUnits(value, 18);
  const [whole, fraction = ""] = formatted.split(".");
  const trimmedFraction = fraction.slice(0, decimalsToShow);
  return trimmedFraction ? `${whole}.${trimmedFraction}` : whole;
}

export function StakingDashboard() {
  const {
    avngBalance,
    vbrBalance,
    amountStaked,
    earnedRewards,
    isStakingPaused,
    isLoading,
  } = useWakandaData();

  return (
    <div
      className="flex flex-col gap-6 w-full text-left"
      style={{ direction: "ltr" }}
    >
      {/* Emergency Global Notification */}
      {isStakingPaused && (
        <div className="rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-950/40 to-red-900/10 p-4 text-sm text-red-300 backdrop-blur-xl flex items-center gap-3 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="font-medium tracking-wide">
            Notice: New staking deposits are temporarily paused by the
            administrator. Unstaking and reward claims remain fully functional.
          </span>
        </div>
      )}

      {/* Grid Layout for Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
        <StatCard
          label="AVNG Balance"
          value={formatToken(avngBalance)}
          symbol="AVNG"
          glowColor="rgba(147,51,234,0.2)"
          borderColor="border-purple-500/30 hover:border-purple-500"
          textColor="text-purple-400 bg-purple-500/10 border-purple-500/30"
          icon={
            <svg
              className="w-5 h-5 text-purple-400"
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
          }
          isLoading={isLoading}
        />

        <StatCard
          label="VBR Balance"
          value={formatToken(vbrBalance)}
          symbol="VBR"
          glowColor="rgba(6,182,212,0.2)"
          borderColor="border-cyan-500/30 hover:border-cyan-500"
          textColor="text-cyan-400 bg-cyan-500/10 border-cyan-500/30"
          icon={
            <svg
              className="w-5 h-5 text-cyan-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          }
          isLoading={isLoading}
        />

        <StatCard
          label="Total Staked Amount"
          value={formatToken(amountStaked)}
          symbol="AVNG"
          glowColor="rgba(236,72,153,0.2)"
          borderColor="border-pink-500/30 hover:border-pink-500"
          textColor="text-pink-400 bg-pink-500/10 border-pink-500/30"
          icon={
            <svg
              className="w-5 h-5 text-pink-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10m9-10V3a2 2 0 00-2-2h-2a2 2 0 00-2 2v14a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14a2 2 0 002 2h2a2 2 0 002-2z"
              />
            </svg>
          }
          isLoading={isLoading}
        />

        <StatCard
          label="Live Pending Reward"
          value={formatToken(earnedRewards)}
          symbol="VBR"
          glowColor="rgba(245,158,11,0.3)"
          borderColor="border-amber-500/40 hover:border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
          textColor="text-amber-400 bg-amber-500/10 border-amber-500/40"
          icon={
            <svg
              className="w-5 h-5 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0H4m8 0h8"
              />
            </svg>
          }
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  symbol,
  glowColor,
  borderColor,
  textColor,
  icon,
  isLoading,
}: {
  label: string;
  value: string;
  symbol: string;
  glowColor: string;
  borderColor: string;
  textColor: string;
  icon: React.ReactNode;
  isLoading: boolean;
}) {
  return (
    <div
      style={{
        boxShadow: `0 12px 30px -10px rgba(13,10,27,0.4), 0 0 20px -2px ${glowColor}`,
      }}
      className={`relative overflow-hidden rounded-2xl border border-white/5 bg-[#110d24] p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 ${borderColor}`}
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <p className="text-xs font-bold tracking-wide text-gray-400 uppercase font-sans">
          {label}
        </p>
        <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
          {icon}
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <span className="h-8 w-32 animate-pulse rounded-lg bg-white/10" />
          </div>
        ) : (
          <span className="text-2xl font-black font-mono tracking-tight text-white select-all">
            {value}
          </span>
        )}
        <span
          className={`text-xs font-black font-mono px-2.5 py-1 rounded-lg border shadow-sm ${textColor}`}
        >
          {symbol}
        </span>
      </div>

      <div
        style={{ backgroundColor: glowColor }}
        className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full blur-2xl opacity-50 pointer-events-none"
      />
    </div>
  );
}
