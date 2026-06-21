import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "../config/wagmi"; // مطمئن شوید مسیر درست است

const queryClient = new QueryClient();

const wakandaTheme = {
  ...darkTheme(),
  colors: {
    ...darkTheme().colors,
    accentColor: "#8b5cf6",
    accentColorForeground: "#ffffff",
    modalBackground: "#0d0a1b",
  },
  radii: {
    ...darkTheme().radii,
    actionButton: "12px",
    modal: "16px",
  },
};

// ... بقیه ایمپورت‌ها
export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* modalSize="compact" را نگه دار، این باعث می‌شود مودال زیباتر و کوچک‌تر شود */}
        <RainbowKitProvider theme={wakandaTheme} modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
