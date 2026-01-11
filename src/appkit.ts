import { createAppKit } from "@reown/appkit/react";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";
import { mainnet, sepolia } from "@reown/appkit/networks";

const projectId = process.env.REACT_APP_REOWN_PROJECT_ID as string;

const metadata = {
  name: "Lumangi",
  description: "Lumangi dApp",
  url: window.location.origin,          // auto: http://localhost:2468
  icons: [`${window.location.origin}/lumanagi-coin1.png`],
};


createAppKit({
  projectId,
  metadata,
  networks: [mainnet, sepolia],
  adapters: [new Ethers5Adapter()],
});
