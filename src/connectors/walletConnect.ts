import { initializeConnector } from "@web3-react/core";
import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";

import { URLS } from "../constants/networks";

/*
 * PRESENT IN INITIAL VERSION (conceptually):
 * WalletConnect needs a projectId (Reown / WalletConnect Cloud).
 */
const projectId = process.env.REACT_APP_REOWN_PROJECT_ID as string;

if (!projectId) {
  throw new Error(
    "Missing REACT_APP_REOWN_PROJECT_ID in .env (WalletConnect / Reown projectId)"
  );
}

/*
 * PRESENT IN INITIAL VERSION:
 * Chain identifiers.
 */
const MAINNET = 1;
const SEPOLIA = 11155111;

/*
 * CHOOSE YOUR DEFAULT CHAIN HERE (keep it simple).
 * - For testnet dev: SEPOLIA
 * - For production: MAINNET
 */
export const WALLETCONNECT_DEFAULT_CHAIN_ID = SEPOLIA; // change to MAINNET if needed

/*
 * CHANGED VS INITIAL VERSION:
 * URLS is Record<number, string[]> in this repo, but WalletConnect v2 wants
 * rpcMap: Record<number, string>.
 */
const rpcMap: Record<number, string> = Object.fromEntries(
  Object.entries(URLS).map(([chainId, urls]) => {
    const first = Array.isArray(urls) ? urls[0] : urls;
    if (!first) throw new Error(`No RPC URL configured for chain ${chainId}`);
    return [Number(chainId), first];
  })
) as Record<number, string>;

/*
 * ADDED SAFETY:
 * If your URLS does not contain the default chain, fail fast with a clear message.
 */
if (!rpcMap[WALLETCONNECT_DEFAULT_CHAIN_ID]) {
  throw new Error(
    `URLS/rpcMap is missing chain ${WALLETCONNECT_DEFAULT_CHAIN_ID}. Add an RPC URL for it in constants/networks.ts`
  );
}

export const [walletConnect, hooks] = initializeConnector<WalletConnectV2>(
  (actions) =>
    new WalletConnectV2({
      actions,
      options: {
        projectId,

        /*
         * IMPORTANT (v2 rule):
         * The default chain MUST be in "chains".
         */
        chains: [WALLETCONNECT_DEFAULT_CHAIN_ID],

        /*
         * Optional: allow switching if you also have RPC URLs for them.
         * Keep this minimal; only include chains you have in URLS.
         */
        optionalChains: Object.keys(rpcMap)
          .map(Number)
          .filter((id) => id !== WALLETCONNECT_DEFAULT_CHAIN_ID),

        showQrModal: true,
        rpcMap,
      },
    })
);
