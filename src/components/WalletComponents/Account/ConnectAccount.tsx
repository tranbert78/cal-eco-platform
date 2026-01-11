// src/components/auth/ConnectWallet.tsx
import React, { useEffect, useRef } from "react";

// Reown AppKit (WalletConnect v2 / modern flow)
// This replaces ALL manual connector activation logic.
import { useAppKit } from "@reown/appkit/react";

import Metamask from "../../assets/wallet/Metamask.svg";
import Phantom from "../../assets/wallet/Phantom.svg";
import Coinbase from "../../assets/wallet/Coinbase.svg";
import WalletConnectIcon from "../../assets/wallet/WalletConnect.svg";

interface ConnectModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedWallet: React.Dispatch<
    React.SetStateAction<"MetaMask" | "WalletConnect" | "Coinbase" | null>
  >;
}

/**
 * ConnectWallet (AppKit version)
 *
 * REMOVED (old approach):
 *   import { metaMask } from "../../connectors/metaMask";
 *   import { walletConnect } from "../../connectors/walletConnect";
 *   import { coinbaseWallet } from "../../connectors/coinbaseWallet";
 *
 * REMOVED (old approach):
 *   await metaMask.activate()
 *   await walletConnect.activate()
 *   await coinbaseWallet.activate()
 *
 * REPLACEMENT:
 *   AppKit owns the connection lifecycle.
 *   We simply call open() to show the AppKit modal.
 */
const ConnectWallet: React.FC<ConnectModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  setSelectedWallet,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // AppKit modal controller
  const { open } = useAppKit();

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

  /**
   * New connection flow:
   * - "MetaMask / Coinbase / WalletConnect" is now just a UI hint.
   * - AppKit will present the available wallets and handle the protocol safely.
   */
  const connectWith = async (label: "MetaMask" | "WalletConnect" | "Coinbase") => {
    try {
      setSelectedWallet(label);

      // Optional: keep only if you use it elsewhere for UX (auto-open / remember choice)
      window.localStorage.setItem("connectorId", label);

      setIsModalOpen(false);

      // This opens the AppKit modal (WalletConnect v2 flow)
      await open();
    } catch (err) {
      // If user closes the modal or something fails, we don't crash the UI.
      // You can also show a toast/snackbar here if you want.
      // console.error("AppKit connect error:", err);
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
                    onClick={() => connectWith("MetaMask")}
                    className="flex items-center gap-4 w-full rounded-lg border border-gray-600 p-3 text-left hover:border-gray-500 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:opacity-90"
                  >
                    <img src={Metamask} alt="Metamask" />
                    <span className="px-2 text-lg font-semibold text-white font-inter">
                      Continue with Metamask
                    </span>
                  </button>

                  {/* Phantom is not an EVM wallet connector in this stack.
                      Keep the button if you want, but disable it to avoid confusing users. */}
                  <button
                    type="button"
                    disabled
                    title="Not supported in this build"
                    className="flex items-center gap-4 w-full rounded-lg border border-gray-600/60 p-3 text-left opacity-50 cursor-not-allowed"
                  >
                    <img src={Phantom} alt="Phantom" />
                    <span className="px-2 text-lg font-semibold text-white font-inter">
                      Continue with Phantom (not supported)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => connectWith("Coinbase")}
                    className="flex items-center gap-4 w-full rounded-lg border border-gray-600 p-3 text-left hover:border-gray-500 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:opacity-90"
                  >
                    <img src={Coinbase} alt="Coinbase" />
                    <span className="px-2 text-lg font-semibold text-white font-inter">
                      Continue with Coinbase
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => connectWith("WalletConnect")}
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
