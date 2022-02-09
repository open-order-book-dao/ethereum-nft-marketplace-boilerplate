import SDK from "@open-order-book-dao/orderbook-client-sdk-js";
import React from "react";
import OpenOrdersContext from "./context";

function OpenOrdersProvider({ children }) {
  const sdk = new SDK({
    apiEndpoint: "http://localhost:8080",
  });

  return (
    <OpenOrdersContext.Provider value={{ sdk }}>
      {children}
    </OpenOrdersContext.Provider>
  );
}

function useOpenOrders() {
  const context = React.useContext(OpenOrdersContext);
  if (context === undefined) {
    throw new Error("useOpenOrders must be used within a MoralisDappProvider");
  }
  return context;
}

export { OpenOrdersProvider, useOpenOrders };
