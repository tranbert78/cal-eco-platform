/**
 * Wallet connector refactor.
 * Migrates WalletConnect v1 → v2, adds deterministic chain selection
 * and explicit supported-network constraints.
 *
 * Refactor by Bertrand (tranbert78).
 */
import { initializeConnector } from "@web3-react/core";
import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";
import { URLS } from "../constants/networks";

/**
 * WalletConnect v2 requires a Cloud Project ID.
 * This value is public (bundled in the frontend), so it’s safe to ship.
 */
const projectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID as string;
if (!projectId || projectId.trim().length === 0) {
  throw new Error("Missing REACT_APP_WALLETCONNECT_PROJECT_ID in .env");
}

/**
 * Chain IDs
 */
const MAINNET = 1;
const SEPOLIA = 11155111;

/**
 * Optional explicit override (wins over NODE_ENV):
 *   REACT_APP_NETWORK=sepolia | mainnet
 *
 * Default rule:
 *   development -> Sepolia
 *   production  -> Mainnet
 */
const networkOverride = (process.env.REACT_APP_NETWORK || "").toLowerCase().trim();

function resolveDefaultChainId(): number {
  if (networkOverride === "sepolia") return SEPOLIA;
  if (networkOverride === "mainnet") return MAINNET;

  return process.env.NODE_ENV === "development" ? SEPOLIA : MAINNET;
}

export const WALLETCONNECT_DEFAULT_CHAIN_ID = resolveDefaultChainId();

/**
 * Explicitly supported chains (only expose what the app truly supports).
 * Keep this tight to avoid users switching into unsupported networks.
 */
const SUPPORTED_CHAINS: number[] = [MAINNET, SEPOLIA];

/**
 * WalletConnect v2 requires:
 *   rpcMap: Record<number, string>
 *
 * We derive it from URLS (Record<number, string[]>) by taking the first *non-empty* RPC URL.
 */
const rpcMap: Record<number, string> = Object.fromEntries(
  Object.entries(URLS).map(([chainId, urls]) => {
    const list = Array.isArray(urls) ? urls : [urls];
    const url = list.find((u) => typeof u === "string" && u.trim().length > 0);

    if (!url) throw new Error(`No RPC URL configured for chain ${chainId}`);
    return [Number(chainId), url];
  })
) as Record<number, string>;

/**
 * Safety checks
 */
if (!SUPPORTED_CHAINS.includes(WALLETCONNECT_DEFAULT_CHAIN_ID)) {
  throw new Error(
    `Default chain ${WALLETCONNECT_DEFAULT_CHAIN_ID} is not in SUPPORTED_CHAINS (${SUPPORTED_CHAINS.join(
      ", "
    )}).`
  );
}

for (const chainId of SUPPORTED_CHAINS) {
  if (!rpcMap[chainId]) {
    throw new Error(
      `rpcMap is missing chain ${chainId}. Add an RPC URL for it in constants/networks.ts`
    );
  }
}

/**
 * WalletConnect session negotiation:
 * - "chains" must include the default chain
 * - "optionalChains" are additional chains the wallet may switch to
 */
const optionalChains = SUPPORTED_CHAINS.filter(
  (id) => id !== WALLETCONNECT_DEFAULT_CHAIN_ID
);

export const [walletConnect, hooks] = initializeConnector<WalletConnectV2>(
  (actions) =>
    new WalletConnectV2({
      actions,
      options: {
        projectId,
        chains: [WALLETCONNECT_DEFAULT_CHAIN_ID],
        optionalChains,
        rpcMap,
        showQrModal: true,
      },
    })
);
