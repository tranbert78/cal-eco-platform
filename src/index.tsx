import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SnackbarProvider } from "notistack";

/*
 * PRESENT IN INITIAL GITHUB FILE:
 * Web3ReactProvider was already used to wrap the application.
 * It is required because many components call useWeb3React().
 */
import { Web3ReactProvider } from "@web3-react/core";

/*
 * ADDED IN LAST VERSION (NOT PRESENT IN INITIAL GITHUB FILE):
 *
 * Side-effect initialization for Reown / AppKit.
 * This file did not exist in the initial version.
 *
 * This import does NOT provide React context and does NOT
 * replace Web3ReactProvider. It only runs setup code.
 */
// import "./web3/appkit";

/*
 * REMOVED from initial file:
 *
 * The initial version imported a centralized connector registry, typically:
 *
 *   import connectors from "./connectors";
 *   or
 *   import connectors from "./connectors/index";
 *
 * That registry file is no longer used.
 *
 * ADDED IN LAST VERSION:
 * Connectors are now imported directly from their individual modules
 * created via initializeConnector.
 * Each module exports a connector instance and its associated hooks.
 */
import { metaMask, hooks as metaMaskHooks } from "./connectors/metaMask";
import { walletConnect, hooks as walletConnectHooks } from "./connectors/walletConnect";

/*
 * REMOVED from initial file:
 *
 * The `connectors` value originally came from the centralized registry import.
 *
 * ADDED IN LAST VERSION:
 * The connectors array is now constructed locally from individual connectors
 * and their hooks, as required by Web3ReactProvider in v8.
 */
const connectors: [any, any][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
];

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    {/*
     * PRESENT IN INITIAL GITHUB FILE:
     * Web3ReactProvider wrapped the application.
     *
     * REMOVED TEMPORARILY DURING REFACTORING (CAUSED RUNTIME ERRORS):
     * This wrapper was commented out at one point, which caused
     * useWeb3React() to throw and the app to render a blank page.
     *
     * RESTORED IN LAST VERSION:
     * The provider wrapper is reinstated and correctly configured
     * with the connectors array.
     */}
    <Web3ReactProvider connectors={connectors}>
      <SnackbarProvider anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <App />
      </SnackbarProvider>
    </Web3ReactProvider>
  </React.StrictMode>
);
