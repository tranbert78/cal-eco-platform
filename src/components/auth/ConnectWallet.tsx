import React, { useEffect, useRef } from "react";

import { coinbaseWallet } from "../../connectors/coinbaseWallet";
import { metaMask } from "../../connectors/metaMask";

/*
 * PRESENT IN INITIAL VERSION:
 * WalletConnect connector import existed here.
 *
 * CHANGED IN LATEST VERSION:
 * - Still imports the connector, but now also imports a single “source of truth”
 *   for the default chainId to avoid hardcoding 1 vs 11155111 in this UI file.
 * - This prevents WalletConnect v2 “Invalid chainId …” errors caused by mismatch
 *   between UI and connector configuration.
 */
import {
  walletConnect,
  WALLETCONNECT_DEFAULT_CHAIN_ID,
} from "../../connectors/walletConnect";

import Metamask from "../../assets/wallet/Metamask.svg";
import Phantom from "../../assets/wallet/Phantom.svg";
import Coinbase from "../../assets/wallet/Coinbase.svg";

/*
 * PRESENT IN INITIAL VERSION:
 * The asset import name was WalletConnect.
 *
 * CHANGED IN LATEST VERSION:
 * Renamed to WalletConnectIcon to avoid confusion with the connector variable
 * `walletConnect` imported above.
 */
import WalletConnectIcon from "../../assets/wallet/WalletConnect.svg";

interface ConnectModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedWallet: React.Dispatch<
    React.SetStateAction<"MetaMask" | "WalletConnect" | "Coinbase" | null>
  >;
}

const ConnectWallet: React.FC<ConnectModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  setSelectedWallet,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    const id = window.setTimeout(() => {
      dialogRef.current?.focus();
    }, 0);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(id);
    };
  }, [isModalOpen, setIsModalOpen]);

  const activateConnector = async (label: string) => {
    /*
     * REMOVED FROM INITIAL VERSION:
     * - no error handling, making failures look like “nothing happens”
     *
     * ADDED IN LATEST VERSION:
     * - try/catch + console.error so activation issues are visible
     * - close modal after successful activation (and before WC so QR is not hidden)
     */
    try {
      switch (label) {
        case "MetaMask": {
          await metaMask.activate();
          setSelectedWallet("MetaMask");
          window.localStorage.setItem("connectorId", "injected");
          setIsModalOpen(false);
          break;
        }

       case "WalletConnect": {
  try {
    setIsModalOpen(false);
    await new Promise((r) => setTimeout(r, 50));

    console.log("WalletConnect: activating...");
    await walletConnect.activate(); // use connector's default chain

    console.log("WalletConnect: activated");
    setSelectedWallet("WalletConnect");
    window.localStorage.setItem("connectorId", "wallet_connect_v2");
  } catch (err) {
    console.error("WalletConnect activate failed:", err);

    // Re-open your modal so the user can retry
    setIsModalOpen(true);

    // Optional: clear stored connectorId on failure
    window.localStorage.removeItem("connectorId");
  }
  break;
}
        case "Coinbase": {
          await coinbaseWallet.activate();
          setSelectedWallet("Coinbase");

          /*
           * FIXED VS INITIAL VERSION:
           * Coinbase incorrectly stored "injected". Use a distinct id.
           */
          window.localStorage.setItem("connectorId", "coinbase");

          setIsModalOpen(false);
          break;
        }

        default:
          break;
      }
    } catch (err) {
      console.error(`${label} activate failed:`, err);

      /*
       * ADDED IN LATEST VERSION:
       * Re-open the modal if activation fails so the user can retry.
       */
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="connect-wallet-title"
        >
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div
              ref={dialogRef}
              tabIndex={-1}
              className="w-full max-w-md rounded-2xl bg-custom-gradient p-6 shadow-2xl outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                id="connect-wallet-title"
                className="text-3xl font-semibold text-white font-poppins"
              >
                Connect a wallet
              </h2>

              <div>
                <p className="self-start text-base leading-10 text-gray-300 font-inter">
                  Don&apos;t have an account?
                  <a
                    href="#aa"
                    className="ml-1 font-semibold text-primary-900-high-emphasis hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-900-high-emphasis/50 rounded-sm"
                  >
                    Register here
                  </a>
                </p>

                <div className="mt-6 flex flex-col gap-4">
                  <button
                    type="button"
                    onClick={() => activateConnector("MetaMask")}
                    className="flex items-center gap-4 w-full rounded-lg border border-gray-600 p-3 text-left hover:border-gray-500 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:opacity-90"
                  >
                    <img src={Metamask} alt="Metamask" />
                    <span className="px-2 text-lg font-semibold text-white font-inter">
                      Continue with Metamask
                    </span>
                  </button>

                  {/* PRESENT IN INITIAL VERSION: Phantom is UI-only (no connector wired yet) */}
                  <button
                    type="button"
                    className="flex items-center gap-4 w-full rounded-lg border border-gray-600 p-3 text-left hover:border-gray-500 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:opacity-90"
                  >
                    <img src={Phantom} alt="Phantom" />
                    <span className="px-2 text-lg font-semibold text-white font-inter">
                      Continue with Phantom
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => activateConnector("Coinbase")}
                    className="flex items-center gap-4 w-full rounded-lg border border-gray-600 p-3 text-left hover:border-gray-500 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:opacity-90"
                  >
                    <img src={Coinbase} alt="Coinbase" />
                    <span className="px-2 text-lg font-semibold text-white font-inter">
                      Continue with Coinbase
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => activateConnector("WalletConnect")}
                    className="flex items-center gap-4 w-full rounded-lg border border-gray-600 p-3 text-left hover:border-gray-500 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:opacity-90"
                  >
                    <img src={WalletConnectIcon} alt="WalletConnect" />
                    <span className="px-2 text-lg font-semibold text-white font-inter">
                      Continue with WalletConnect
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConnectWallet;
