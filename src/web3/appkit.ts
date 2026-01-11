import { createAppKit } from "@reown/appkit/react";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";
import { mainnet, sepolia } from "@reown/appkit/networks";

const projectId = process.env.REACT_APP_REOWN_PROJECT_ID as string;

if (!projectId) {
  throw new Error("REACT_APP_REOWN_PROJECT_ID is missing");
}

createAppKit({
  projectId,
  metadata: {
    name: "Lumangi",
    description: "Lumangi dApp",
    url: window.location.origin,
    icons: [`${window.location.origin}/lumangi-coin.png`],
  },
  networks: [mainnet, sepolia],
  adapters: [new Ethers5Adapter()],
});
