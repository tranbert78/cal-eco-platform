import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { Web3ReactHooks } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { Network } from "@web3-react/network";
import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";

import { coinbaseWallet, hooks as coinbaseWalletHooks } from "./coinbaseWallet";
import { hooks as metaMaskHooks, metaMask } from "./metaMask";
import { hooks as networkHooks, network } from "./network";
import { hooks as walletConnectHooks, walletConnect } from "./walletConnect";

/**
 * What changed:
 * - Removed WalletConnect v1 import:
 *     import { WalletConnect } from "@web3-react/walletconnect";
 * - Replaced it with WalletConnect v2:
 *     import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";
 */
const connectors: [
  MetaMask | WalletConnectV2 | CoinbaseWallet | Network,
  Web3ReactHooks
][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [coinbaseWallet, coinbaseWalletHooks],
  [network, networkHooks],
];

export default connectors;
