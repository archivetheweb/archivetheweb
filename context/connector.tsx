import { WarpFactory } from "warp-contracts";
import { createContext } from "react";
import { AtwContract } from "../bindings/ts/AtwContract";
import { CONTRACT_ADDRESS } from "../components/utils";

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
  contract: new AtwContract(CONTRACT_ADDRESS, warp),
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
