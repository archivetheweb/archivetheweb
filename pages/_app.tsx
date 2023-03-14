import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import ConnectorContext, { emptyState } from "../context/connector";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Archive the Web</title>
        <meta
          name="description"
          content="Archive the Web is an open-source website archiving tool that allows you to set up automated archiving stored on Arweave. Our mission at Archive the Web is to create a decentralized backup of the world wide web together."
        />
        <meta
          property="og:description"
          content="Archive the Web is an open-source website archiving tool that allows you to set up automated archiving stored on Arweave. Our mission at Archive the Web is to create a decentralized backup of the world wide web together."
        />
        <meta property="og:title" content="Archive The Web" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://arweave.net/HSXsrUHoSsMP7hqkTJe_NhEzD5W77rg4OsLhy1xYTqs"
        />
        <meta property="og:url" content="https://archivetheweb.com/" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ConnectorContext.Provider value={emptyState}>
        <Component {...pageProps} />
      </ConnectorContext.Provider>
    </>
  );
}
