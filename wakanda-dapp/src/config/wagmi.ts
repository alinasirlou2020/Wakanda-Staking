import "@rainbow-me/rainbowkit/styles.css"; 
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";

const polygonAmoy = defineChain({
  id: 80002,
  name: "Polygon Amoy",
  nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc-amoy.polygon.technology"] } },
});

export const config = getDefaultConfig({
  appName: "Wakanda Staking",
  projectId: "542c06313f51345944e5c24809c43754", // پروجکت آی‌دی تو
  chains: [polygonAmoy],
  ssr: true,
});