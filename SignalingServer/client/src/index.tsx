import * as React from "react";
import * as ReactDOM from "react-dom";

import { Peers } from "./Peers";

const signalingServerAddress = "ws://127.0.0.1:8001"

ReactDOM.render(
    <Peers signalingServerAddress={signalingServerAddress} />,
    document.getElementById("container")
);
