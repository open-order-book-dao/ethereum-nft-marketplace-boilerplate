import { RightCircleOutlined } from "@ant-design/icons";
import { Card, Image, Tooltip } from "antd";
import { getCollectionsByChain } from "helpers/collections";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import React from "react";
import { useHistory } from "react-router";

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

function Collections() {

  const { chainId } =
    useMoralisDapp();

  const NFTCollections = getCollectionsByChain(chainId);

  const history = useHistory();


  return (
        <div style={styles.NFTs}>
          {
            NFTCollections?.map((collection, index) => (
              <Card
                hoverable
                actions={[
                  <Tooltip title="View Collection">
                    <RightCircleOutlined
                      onClick={() =>history.push(`/collection/${collection.addrs}`)}
                    />
                  </Tooltip>,
                ]}
                style={{ width: 240, border: "2px solid #e7eaf3" }}
                cover={
                  <Image
                    preview={false}
                    src={collection?.image || "error"}
                    alt=""
                    style={{ height: "240px" }}
                  />
                }
                key={index}
              >
                <Meta title={collection.name} />
              </Card>
            ))}
      </div>

  );
}

export default Collections;
