import { ConnectButton } from "@rainbow-me/rainbowkit";

export function WalletConnect() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
        openChainModal,
        openAccountModal,
        mounted,
      }) => {
        if (!mounted) return null;

        return (
          <div className="flex items-center gap-2">
            {!account || !chain ? (
              <button
                onClick={openConnectModal}
                className="px-6 py-3 font-bold text-white rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] transition-all hover:opacity-90 shadow-lg"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {/* دکمه تغییر شبکه */}
                <button
                  onClick={openChainModal}
                  className="px-4 py-2 bg-[#0d0a1b] border border-purple-500/20 rounded-xl flex items-center gap-2 text-white hover:bg-[#16122d]"
                >
                  {chain.hasIcon && (
                    <img src={chain.iconUrl} className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">{chain.name}</span>
                </button>

                {/* دکمه اکانت - حالا با openAccountModal پاپ‌آپ دیسکانکت باز می‌شود */}
                <button
                  onClick={openAccountModal}
                  className="px-4 py-2 bg-[#1e1b4b] border border-purple-500/30 rounded-xl text-white font-medium hover:border-purple-400"
                >
                  {account.displayName}
                </button>
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
