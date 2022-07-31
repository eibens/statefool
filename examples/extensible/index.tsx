/** EXTERNALS **/

import React from "react";
import { createRoot } from "react-dom-client";

/** LOCALS **/

import App from "./containers/App/mod.ts";
import { insert } from "./core.ts";

/** MAIN **/

if (globalThis.document) {
  insert("number", "number1", { value: 0 });
  insert("number", "number2", { value: 0 });

  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(<App />);
}
