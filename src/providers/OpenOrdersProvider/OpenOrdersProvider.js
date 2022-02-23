import SDK from "@openorders.dao/orderbook-client-sdk-js";
import React, {useCallback, useEffect, useState} from "react";
import OpenOrdersContext from "./context";
import Moralis from "moralis";

function OpenOrdersProvider({ children }) {
  const sdk = new SDK({
    apiEndpoint: "https://9s0bbkexch.execute-api.us-east-1.amazonaws.com",
  });
  console.log({sdk})

  const [signer, setSigner] = useState(null);

  const updateSigner = useCallback(async () => {
    const provider = await Moralis.enableWeb3();
    const signerOfExecutingWallet = provider.getSigner();
    setSigner(signerOfExecutingWallet);
  }, []);

  useEffect(() => {
    updateSigner();
  }, [updateSigner]);

  return (
    <OpenOrdersContext.Provider value={{ sdk, signer }}>
      {children}
    </OpenOrdersContext.Provider>
  );
}

function useOpenOrders() {
  const context = React.useContext(OpenOrdersContext);
  if (context === undefined || !context.sdk) {
    throw new Error("useOpenOrders must be used within a OpenOrdersProvider");
  }
  return context;
}

export { OpenOrdersProvider, useOpenOrders };
