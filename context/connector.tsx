import { Warp, Contract, WarpFactory } from "warp-contracts";
import { createContext, useState, useContext, useMemo } from "react";
import { AwtContract } from "../bindings/ts/AwtContract";

const CONTRACT = "Q-Eb1-CrbZi_pszCec2QafJ6lDO5dtlC53KpoxeGzWM";

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

const ConnectorContext = createContext(emptyState);

export default ConnectorContext;
