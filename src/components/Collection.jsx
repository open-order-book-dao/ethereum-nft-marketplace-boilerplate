import { FileSearchOutlined } from "@ant-design/icons";
import { Card, Image, Tooltip } from "antd";
import { useNFTTokenIds } from "hooks/useNFTTokenIds";
import React from "react";
import { useHistory, useParams } from "react-router";

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

function NFTTokenIds() {
  let { contract: inputValue } = useParams();
  const { NFTTokenIds } = useNFTTokenIds(inputValue);
  const history = useHistory();
  return (
    <div style={styles.NFTs}>
      {NFTTokenIds &&
        NFTTokenIds.map((nft, index) => (
          <Card
            hoverable
            onClick={() =>
              history.push(`/collection/${inputValue}/${nft.token_id}`)
            }
            style={{ width: 240, border: "2px solid #e7eaf3" }}
            cover={
              <Image
                preview={false}
                src={nft.image || "error"}
                alt=""
                style={{ height: "240px" }}
              />
            }
            key={index}
          >
            <Meta title={nft.name} description={`#${nft.token_id}`} />
          </Card>
        ))}
    </div>
  );
}

export default NFTTokenIds;
