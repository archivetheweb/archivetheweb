import { WarpFactory } from "warp-contracts";
import { createContext } from "react";
import { AwtContract } from "../bindings/ts/AwtContract";

const CONTRACT = "-27RfG2DJAI3ddQlrXkN1rmS5fBSC4eG8Zfhz8skYTU";

type Blockchain = {
  name: string;
  id: string;
};
let warp = WarpFactory.forMainnet();

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
};

(async () => {
  if (!localStorage.getItem("arweave_wallet")) {
    console.debug("generating new wallet");
    let { jwk: wallet, address: walletAddress } = await warp.generateWallet();
    localStorage.setItem("arweave_wallet", JSON.stringify(wallet));
    localStorage.setItem("arweave_address", walletAddress);
  }
})();
const ConnectorContext = createContext(emptyState);

export default ConnectorContext;
