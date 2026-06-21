import { http, createConfig } from "wagmi";
import { defineChain } from "viem";
import { injected, walletConnect } from "wagmi/connectors"; // اضافه کردن walletConnect

export const polygonAmoy = defineChain({
  id: 80002,
  name: "Polygon Amoy",
  nativeCurrency: { decimals: 18, name: "POL", symbol: "POL" },
  rpcUrls: {
    default: { http: ["https://rpc-amoy.polygon.technology"] },
  },
  blockExplorers: {
    default: { name: "PolygonScan Amoy", url: "https://amoy.polygonscan.com" },
  },
  testnet: true,
});

export const wagmiConfig = createConfig({
  chains: [polygonAmoy],
  connectors: [
    injected(),
    // اینجا باید projectId خودت را از سایت walletconnect.com بگیری و بگذاری
    walletConnect({
      projectId: "542c06313f51345944e5c24809c43754",
    }),
  ],
  transports: {
    [polygonAmoy.id]: http("https://rpc-amoy.polygon.technology"),
  },
});
