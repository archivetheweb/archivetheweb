import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html prefix="og: https://ogp.me/ns#">
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script
          src="./replay/ui.js"
          strategy="beforeInteractive"
          onReady={() => {
            console.log("ready in doc...");
          }}
        />
      </body>
    </Html>
  );
}
