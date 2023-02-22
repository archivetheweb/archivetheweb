import { WarpFactory } from "warp-contracts";
import { createContext } from "react";
import { AwtContract } from "../bindings/ts/AwtContract";

const CONTRACT = "-27RfG2DJAI3ddQlrXkN1rmS5fBSC4eG8Zfhz8skYTU";

type Blockchain = {
  name: string;
  id: string;
};
let warp = WarpFactory.forMainnet();

const ARWEAVE_WALLET = "arweave_wallet";
const ARWEAVE_ADDRESS = "arweave_address";

export const emptyState = {
  address: "",
  blockchain: {
    name: "arweave",
    id: "",
  } as Blockchain,
  setAddress: () => {},
  isConnected: false,
  isConnecting: false,
  connect: () => {},
  warp: warp,
  contract: new AwtContract(CONTRACT, warp),
  getLocalAddress: async () => {
    return await getWallet();
  },
};

async function getWallet() {
  if (typeof window !== "undefined") {
    let jwk = localStorage.getItem(ARWEAVE_WALLET);
    let address = localStorage.getItem(ARWEAVE_ADDRESS);

    // @ts-nocheck
    if (!jwk || !address) {
      console.debug("generating new wallet");
      let { jwk: wallet, address: walletAddress } = await warp.generateWallet();
      localStorage.setItem(ARWEAVE_WALLET, JSON.stringify(wallet));
      localStorage.setItem(ARWEAVE_ADDRESS, walletAddress);
      jwk = JSON.stringify(wallet);
      address = walletAddress;
    }
    return {
      jwk,
      address,
    };
  }
}

(async () => {
  await getWallet();
})();
const ConnectorContext = createContext(emptyState);

export default ConnectorContext;
