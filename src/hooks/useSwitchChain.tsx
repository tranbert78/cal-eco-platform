import { useWeb3React } from "@web3-react/core";
import { Network } from "@web3-react/network";
import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";

import { getAddChainParameters } from "../constants/networks";

/**
 * What changed:
 * - WalletConnect type now comes from @web3-react/walletconnect-v2
 * - Logic remains the same
 */
export function useSwitchChain() {
  const { connector } = useWeb3React();

  const switchChain = async (desiredChain: number) => {
    const chainParam =
      desiredChain === -1 ? undefined : getAddChainParameters(desiredChain);

    // WalletConnect + Network connectors typically accept a chainId directly.
    if (connector instanceof WalletConnectV2 || connector instanceof Network) {
      await connector.activate(desiredChain === -1 ? undefined : desiredChain);
      return;
    }

    // Injected (MetaMask/Coinbase extension) usually needs addChain params for unknown networks
    await connector.activate(chainParam);
  };

  return switchChain;
}
