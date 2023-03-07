import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import ConnectorContext, { emptyState } from "../context/connector";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Archive the Web</title>
        <meta name="description" content="Archive the web frontend" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ConnectorContext.Provider value={emptyState}>
        <Component {...pageProps} />
      </ConnectorContext.Provider>
    </>
  );
}
