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

  if (!isConnected) {
    return (
      <button
        onClick={() => {
          // اگر در موبایل هستی، مستقیماً WalletConnect را باز کن
          // اگر دسکتاپ هستی، مودال انتخابی را باز کن
          const isMobile = /iPhone|iPad|iPod|Android/i.test(
            navigator.userAgent,
          );
          if (isMobile) {
            connect({ connector: connectors[1] }); // فرض بر اینکه walletConnect دوم است
          } else {
            setIsModalOpen(true);
          }
        }}
        className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-600/20 transition-all duration-300 hover:brightness-110 active:scale-95 font-sans"
      >
        Connect Wallet
      </button>
    );
  }

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
        onClick={() => setIsModalOpen(true)}
        className="rounded-xl border border-white/10 bg-[#090615] px-4 py-2.5 text-xs font-mono font-bold text-gray-300 transition-all hover:border-purple-500/50 hover:text-purple-400"
      >
        {address ? formatAddress(address) : "Connected"}
      </button>

      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />
            <div className="relative z-50 w-full max-w-sm rounded-2xl border border-purple-500/30 bg-[#110d24] p-6 shadow-xl text-center">
              <h3 className="text-white font-bold mb-4">Disconnect Wallet</h3>
              <button
                onClick={() => {
                  disconnect();
                  setIsModalOpen(false);
                }}
                className="w-full rounded-xl bg-gradient-to-r from-red-600 to-rose-600 py-3 text-sm font-bold text-white"
              >
                Confirm Disconnect
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
