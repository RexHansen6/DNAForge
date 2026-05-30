import { createClient, http } from "viem";
import { base } from "viem/chains";
import { createConfig } from "wagmi";
import { coinbaseWallet, injected } from "wagmi/connectors";
import { ONCHAIN_ATTRIBUTION_DATA_SUFFIX } from "@/lib/attribution";

export const config = createConfig({
  chains: [base],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
    coinbaseWallet({
      appName: "DNAForge",
      preference: "all",
    }),
  ],
  multiInjectedProviderDiscovery: true,
  ssr: true,
  client({ chain }) {
    return createClient({
      chain,
      transport: http(),
      dataSuffix: ONCHAIN_ATTRIBUTION_DATA_SUFFIX,
    });
  },
});
