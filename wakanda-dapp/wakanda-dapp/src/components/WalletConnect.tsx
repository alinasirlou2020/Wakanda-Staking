import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { polygonAmoy } from "../config/wagmi";

export function WalletConnect() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // حالت ۱: متصل نیست
  if (!isConnected) {
    return (
      <button
        onClick={() => {
          // استفاده از کانکتورِ walletConnect برای باز شدنِ خودکارِ مودالِ استاندارد
          // کانکتور شماره ۱ در لیست ما walletConnect است
          connect({ connector: connectors[1] });
        }}
        className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-600/20 transition-all duration-300 hover:brightness-110 active:scale-95 font-sans"
      >
        Connect Wallet
      </button>
    );
  }

  // حالت ۲: شبکه اشتباه است
  if (chain?.id !== polygonAmoy.id) {
    return (
      <button
        onClick={() => switchChain({ chainId: polygonAmoy.id })}
        className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:brightness-110 active:scale-95 animate-pulse font-sans"
      >
        Switch to Amoy
      </button>
    );
  }

  // حالت ۳: متصل است
  return (
    <div
      className="flex items-center gap-3 font-sans"
      style={{ direction: "ltr" }}
    >
      <div className="rounded-xl border border-purple-500/30 bg-[#110d24] px-4 py-2.5 text-xs font-bold text-purple-400 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
        {chain.name}
      </div>
      <button
        onClick={() => disconnect()}
        className="rounded-xl border border-white/10 bg-[#090615] px-4 py-2.5 text-xs font-mono font-bold text-gray-300 transition-all hover:border-red-500/50 hover:text-red-400"
      >
        {address ? formatAddress(address) : "Connected"} (Disconnect)
      </button>
    </div>
  );
}
