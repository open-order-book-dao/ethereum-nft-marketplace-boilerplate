import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import MoralisDappContext from "./context";

function MoralisDappProvider({ children }) {
  const { Moralis, chainId, account } = useMoralis();
  const [walletAddress, setWalletAddress] = useState();
  const [currentChainId, setChainId] = useState();
  const [contractABI, setContractABI] = useState(
    '{"noContractDeployed": true}'
  ); //Smart Contract ABI here
  const [marketAddress, setMarketAddress] = useState(); //Smart Contract Address Here

  useEffect(() => {
    Moralis.onChainChanged(function (chain) {
      setChainId(chain);
    });

    Moralis.onAccountChanged(function (address) {
      setWalletAddress(address[0]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setChainId(chainId), [chainId]);
  useEffect(() => setWalletAddress(account), [account]);

  return (
    <MoralisDappContext.Provider
      value={{
        walletAddress,
        chainId: currentChainId,
        marketAddress,
        setMarketAddress,
        contractABI,
        setContractABI,
      }}
    >
      {children}
    </MoralisDappContext.Provider>
  );
}

function useMoralisDapp() {
  const context = React.useContext(MoralisDappContext);
  if (context === undefined) {
    throw new Error("useMoralisDapp must be used within a MoralisDappProvider");
  }
  return context;
}

export { MoralisDappProvider, useMoralisDapp };
