import { useState } from "react";
import { createPortal } from "react-dom";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { polygonAmoy } from "../config/wagmi";

export function WalletConnect() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const [isModalOpen, setIsModalOpen] = useState(false);


  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // State 1: Wallet Not Connected
  if (!isConnected) {
    return (
      <button
        onClick={() => {
          // سعی می‌کند ابتدا WalletConnect را پیدا کند، اگر نبود سراغ Injected می‌رود
          const wcConnector = connectors.find((c) =>
            c.id.includes("walletConnect"),
          );
          const injected = connectors.find((c) => c.id === "injected");

          const connectorToUse = wcConnector || injected;
          if (connectorToUse) {
            connect({ connector: connectorToUse });
          }
        }}
        className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-600/20 transition-all duration-300 hover:brightness-110 active:scale-95 font-sans"
      >
        Connect Wallet
      </button>
    );
  }

  // State 2: Connected to the Wrong Network
  if (chain?.id !== polygonAmoy.id) {
    return (
      <button
        onClick={() => switchChain({ chainId: polygonAmoy.id })}
        className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:brightness-110 active:scale-95 animate-pulse font-sans"
      >
        Wrong Network — Switch to Amoy
      </button>
    );
  }

  // State 3: Fully Connected & On the Correct Network
  return (
    <div
      className="flex items-center gap-3 font-sans"
      style={{ direction: "ltr" }}
    >
      <div className="rounded-xl border border-purple-500/30 bg-[#110d24] px-4 py-2.5 text-xs font-bold text-purple-400 shadow-inner flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
        {chain.name}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-xl border border-white/10 bg-[#090615] px-4 py-2.5 text-xs font-mono font-bold text-gray-300 transition-all hover:border-purple-500/50 hover:text-purple-400 active:scale-95 shadow-lg"
      >
        {address ? formatAddress(address) : "Connected"}
      </button>

      {/* رندر کردن پاپ‌آپ در ریشه اصلی سایت با استفاده از پورتال */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            {/* لایه تارکننده کل صفحه (Backdrop Blur) */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
              onClick={() => setIsModalOpen(false)}
            />

            {/* باکس پیام که دقیقاً در مرکز صفحه قرار می‌گیرد */}
            <div className="relative z-50 w-full max-w-sm rounded-2xl border border-purple-500/30 bg-[#110d24] p-6 shadow-[0_0_50px_rgba(147,51,234,0.3)] text-center transform scale-100 transition-all duration-300">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>

              <h3 className="text-base font-bold text-white mb-2">
                Disconnect Wallet
              </h3>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                Are you sure you want to disconnect your wallet? You can always
                reconnect anytime.
              </p>

              {/* دکمه‌ها */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl bg-white/5 border border-white/10 py-2.5 text-xs font-bold text-gray-300 transition hover:bg-white/10 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    disconnect();
                    setIsModalOpen(false);
                  }}
                  className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 py-2.5 text-xs font-bold text-white shadow-md shadow-red-600/10 transition hover:brightness-110 active:scale-95"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>,
          document.body, // پاپ‌آپ را مستقیما به بادی می‌چسباند تا هدر خرابش نکند
        )}
    </div>
  );
}
