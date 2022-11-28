import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import ConnectorContext, { emptyState } from "../context/connector";

const chains = [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum];

// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: "1bc08808a680328f02879be7ffa70914" }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: "web3Modal", chains }),
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Archive the Web</title>
        <meta name="description" content="Archive the web frontend" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <WagmiConfig client={wagmiClient}>
        <ConnectorContext.Provider value={emptyState}>
          <Component {...pageProps} />
        </ConnectorContext.Provider>
      </WagmiConfig>

      <Web3Modal
        projectId={process.env.WEB3_MODAL_PROJECT_ID}
        ethereumClient={ethereumClient}
      />
    </>
  );
}
