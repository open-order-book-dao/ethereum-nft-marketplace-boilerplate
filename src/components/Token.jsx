import {
  ConsoleSqlOutlined,
  FileSearchOutlined,
  RightCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Alert, Badge, Card, Image, Modal, Spin, Tooltip } from "antd";
import { getCollectionsByChain } from "helpers/collections";
import { getExplorer, getNativeByChain } from "helpers/networks";
import { useNFT } from "hooks/useNFT";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import React, { useCallback, useEffect, useState } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { useOpenOrders } from "../providers/OpenOrdersProvider/OpenOrdersProvider";
import { useHistory, useLocation, useParams } from "react-router";
import { formatUnits } from "@open-order-book-dao/shared";

const { Meta } = Card;

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    gap: "10px",
  },
  banner: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    margin: "0 auto",
    width: "600px",
    //borderRadius: "10px",
    height: "150px",
    marginBottom: "40px",
    paddingBottom: "20px",
    borderBottom: "solid 1px #e3e3e3",
  },
  logo: {
    height: "115px",
    width: "115px",
    borderRadius: "50%",
    // positon: "relative",
    // marginTop: "-80px",
    border: "solid 4px white",
  },
  text: {
    color: "#041836",
    fontSize: "27px",
    fontWeight: "bold",
  },
};

function Token() {
  let { contract: inputValue, tokenId } = useParams();

  const { nft } = useNFT(inputValue, tokenId);
  console.log({ nft });
  const [visible, setVisibility] = useState(false);
  const [nftToBuy, setNftToBuy] = useState(null);
  const [loading, setLoading] = useState(false);

  const { chainId, walletAddress } =
    useMoralisDapp();
  const nativeName = getNativeByChain(chainId);
  const { sdk, signer } = useOpenOrders();

  const { Moralis } = useMoralis();


  const [availableNftOrders, setAvailableNftOrders] = useState({});

  console.log({ availableNftOrders });
  const fetchOrdersOfOneNft = useCallback(
    async (chainId, contractAddress, tokenId) => {
      return await sdk.getAvailableFixedPriceOrdersFromSeller({
        tokenId,
        chainId,
        contractAddress,
      });
    },
    [sdk]
  );

  const fetchAllOrdersOfAllNfts = useCallback(async () => {
    if (!nft) return;
    setAvailableNftOrders({});

    const orders = await fetchOrdersOfOneNft(
      chainId,
      nft.token_address,
      nft.token_id
    );
    console.log({ orders });
    setAvailableNftOrders({ [`${nft.token_address}/${nft.token_id}`]: orders });
  }, [nft, chainId, fetchOrdersOfOneNft]);

  useEffect(() => {
    fetchAllOrdersOfAllNfts();
  }, [fetchAllOrdersOfAllNfts]);

  const handleBuyClick = useCallback(
    async (nft) => {
      setNftToBuy(nft);
      setVisibility(true);
    },
    [setNftToBuy, setVisibility]
  );

  const succPurchase = useCallback(() => {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `You have purchased this NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }, [Modal]);

  const failPurchase = useCallback(() => {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem when purchasing this NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }, [Modal]);

  const getMarketItem = useCallback(
    (nft) => {
      if (!nft) {
        return false;
      }

      const availableOrdersOfThisNft =
        availableNftOrders[`${nft.token_address}/${nft.token_id}`];
      if (!availableOrdersOfThisNft) {
        return false;
      }
      console.log({availableNftOrders})

      const lowestAvailableOffer = [...availableOrdersOfThisNft]
        .sort((a, b) => (a.getPricePerToken() > b.getPricePerToken() ? 1 : -1))
        .shift();
        console.log({lowestAvailableOffer})
      return lowestAvailableOffer ?? false;
    },
    [availableNftOrders]
  );

  const updateSoldMarketItem = useCallback(async () => {
    const id = getMarketItem(nftToBuy).objectId;
    const marketList = Moralis.Object.extend("MarketItems");
    const query = new Moralis.Query(marketList);
    await query.get(id).then((obj) => {
      obj.set("sold", true);
      obj.set("owner", walletAddress);
      obj.save();
    });
  }, [nftToBuy, walletAddress, Moralis, getMarketItem]);

  const purchase = useCallback(async () => {
    setLoading(true);
    const orderFromSeller = getMarketItem(nftToBuy);

    try {
      await sdk.acceptFixedPriceOrderFromSeller(orderFromSeller, signer);
      console.log("success");
      setLoading(false);
      setVisibility(false);
      updateSoldMarketItem();
      succPurchase();
    } catch (e) {
      setLoading(false);
      failPurchase();
      console.error(e);
    }
  }, [
    setLoading,
    getMarketItem,
    nftToBuy,
    setVisibility,
    updateSoldMarketItem,
    succPurchase,
    failPurchase,
  ]);

  if (!nft) return null;

  return (
    <>
      <div>
        <div style={styles.NFTs}>
          <Card
            hoverable
            actions={[
              <Tooltip title="Buy NFT">
                <ShoppingCartOutlined onClick={() => handleBuyClick(nft)} />
              </Tooltip>,
            ]}
            style={{ width: 240, border: "2px solid #e7eaf3" }}
            cover={
              <Image
                preview={false}
                src={nft.image || "error"}
                alt=""
                style={{ height: "240px" }}
              />
            }
          >
            {getMarketItem(nft) !== false && (
              <Badge.Ribbon text="Buy Now" color="green"></Badge.Ribbon>
            )}
            <Meta title={nft.name} description={`#${nft.token_id}`} />
          </Card>
        </div>
        {getMarketItem(nftToBuy) ? (
          <Modal
            title={`Buy ${nftToBuy?.name} #${nftToBuy?.token_id}`}
            visible={visible}
            onCancel={() => setVisibility(false)}
            onOk={() => purchase()}
            okText="Buy"
          >
            <Spin spinning={loading}>
              <div
                style={{
                  width: "250px",
                  margin: "auto",
                }}
              >
                {
                  <Badge.Ribbon
                    color="green"
                    text={`${getMarketItem(nftToBuy).amount} ${nativeName}`}
                  >
                    <img
                      src={nftToBuy?.image}
                      style={{
                        width: "250px",
                        borderRadius: "10px",
                        marginBottom: "15px",
                      }}
                    />
                  </Badge.Ribbon>
                }
              </div>
            </Spin>
          </Modal>
        ) : (
          <Modal
            title={`Buy ${nftToBuy?.name} #${nftToBuy?.token_id}`}
            visible={visible}
            onCancel={() => setVisibility(false)}
            onOk={() => setVisibility(false)}
          >
            <img
              src={nftToBuy?.image}
              style={{
                width: "250px",
                margin: "auto",
                borderRadius: "10px",
                marginBottom: "15px",
              }}
            />
            <Alert
              message="This NFT is currently not for sale"
              type="warning"
            />
          </Modal>
        )}
      </div>
    </>
  );
}

export default Token;
