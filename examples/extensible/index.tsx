/** EXTERNALS **/

import React from "react";
import { createRoot } from "react-dom-client";

/** LOCALS **/

import App from "./containers/App/mod.ts";

/** MAIN **/

if (globalThis.document) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(<App />);
}
