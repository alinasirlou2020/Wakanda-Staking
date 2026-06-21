import { http, createConfig } from "wagmi";
import { defineChain } from "viem";
import { injected } from "wagmi/connectors";

/**
 * تعریف دستی شبکه‌ی Polygon Amoy Testnet با RPC پایدار عمومی
 */
export const polygonAmoy = defineChain({
  id: 80002,
  name: "Polygon Amoy",
  nativeCurrency: {
    decimals: 18,
    name: "POL",
    symbol: "POL",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-amoy.polygon.technology"],
    },
  },
  blockExplorers: {
    default: {
      name: "PolygonScan Amoy",
      url: "https://amoy.polygonscan.com",
    },
  },
  testnet: true,
});

/**
 * پیکربندی wagmi مستقل و مستقیم بدون وابستگی به وب‌سوکت‌های تحریمی WalletConnect
 */
export const wagmiConfig = createConfig({
  chains: [polygonAmoy],
  connectors: [
    injected(), // اتصال مستقیم به افزونه مرورگر متامسک/رابین
  ],
  transports: {
    [polygonAmoy.id]: http("https://rpc-amoy.polygon.technology"),
  },
});
