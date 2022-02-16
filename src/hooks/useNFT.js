import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useEffect, useState } from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useIPFS } from "./useIPFS";

export const useNFT = (contract, tokenId) => {
  const { token } = useMoralisWeb3Api();
  const { chainId } = useMoralisDapp();
  const { resolveLink } = useIPFS();
  const [nft, setNFT] = useState();
  const [fetchSuccess, setFetchSuccess] = useState(true);
  const {
    fetch: getNFT,
    data,
    error,
    isLoading,
  } = useMoralisWeb3ApiCall(token.getTokenIdMetadata, {
    chain: chainId,
    address: contract,
    token_id: tokenId,
  });

  useEffect(() => {
    getNFT();
  }, [getNFT]);

  console.log({ data });
  useEffect(() => {
    async function setupNFT() {
      if (!data) {
        return;
      }
      let image = undefined;
      if (data && data.metadata) {
        const metadata = JSON.parse(data.metadata);
        if (metadata.image) {
          image = resolveLink(metadata.image);
        }
      }
      if (!image) {
        image = await fetch(data.token_uri)
          .then((response) => response.json())
          .then((data) => resolveLink(data.image));
      }
      setNFT({
        ...data,
        image,
      });
      setFetchSuccess(true);
    }
    setupNFT();
  }, [data]);

  return {
    nft,
    fetchSuccess,
    error,
    isLoading,
  };
};
