import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Router from "./router";
import * as serviceWorker from "./serviceWorker";
import "antd-mobile/dist/antd-mobile.css";

let mountNode = document.getElementById("root");
ReactDOM.render(<Router />, mountNode);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
