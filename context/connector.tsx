import { createContext, useState, useContext, useMemo } from "react";

type Blockchain = {
  name: string;
  id: string;
};

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
};
const ConnectorContext = createContext(emptyState);

export default ConnectorContext;
