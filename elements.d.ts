import * as React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["replay-web-page"]: {
        source: string;
        url: string;
        embed?: "default" | "full" | "replayonly" | "replay-with-info";
        ts?: string;
        deepLink?: string;
        replayBase?: string;
        coll?: string;
        config?: string;
        sandbox?: string;
        noWebWorker?: string;
        noCache?: string;
        hideOffScreen?: string;
        newWindowBase?: string;
        requireSubdomainIframe?: string;
        loading?: string;
      };
    }
  }
}
