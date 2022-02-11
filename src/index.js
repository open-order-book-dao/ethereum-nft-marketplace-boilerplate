import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {MoralisProvider} from "react-moralis";
import "./index.css";
import QuickStart from "components/QuickStart";
import {MoralisDappProvider} from "./providers/MoralisDappProvider/MoralisDappProvider";
import {OpenOrdersProvider} from "providers/OpenOrdersProvider/OpenOrdersProvider";
import {
    BrowserRouter as Router,
} from "react-router-dom";

/** Get your free Moralis Account https://moralis.io/ */

const APP_ID = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;

const Application = () => {
    const isServerInfo = APP_ID && SERVER_URL ? true : false;
    if (isServerInfo)
        return (
            <Router>
                <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
                    <MoralisDappProvider>
                        <OpenOrdersProvider>
                            <App isServerInfo/>
                        </OpenOrdersProvider>
                    </MoralisDappProvider>
                </MoralisProvider>
            </Router>
        );
    else {
        return (
            <Router>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <QuickStart/>
                </div>
            </Router>
        );
    }
};

ReactDOM.render(
    // <React.StrictMode>
    <Application/>,
    // </React.StrictMode>,
    document.getElementById("root")
);
