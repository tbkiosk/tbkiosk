import { createContext } from "react";
import { JsonRpcProvider, Network } from "@mysten/sui.js";

const provider = new JsonRpcProvider(Network.DEVNET);

export const SuiJsonRpcContext = createContext<JsonRpcProvider>(provider);

type SuiJsonRpcProviderProps = {
  children: React.ReactNode;
};

export const SuiJsonRpcProvider = ({ children }: SuiJsonRpcProviderProps) => (
  <SuiJsonRpcContext.Provider value={provider}>
    {children}
  </SuiJsonRpcContext.Provider>
);
