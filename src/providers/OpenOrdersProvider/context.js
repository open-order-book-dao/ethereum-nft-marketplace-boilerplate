import React from "react";

const OpenOrdersContext = React.createContext({
    sdk: null,
    signer: null,
});

export default OpenOrdersContext;
