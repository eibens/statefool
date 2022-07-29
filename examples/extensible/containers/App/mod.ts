/** LOCALS **/

import { getActor, render, update } from "../../core.ts";
import Component from "./component.tsx";

/** MAIN **/

export default update(function App() {
  const App = getActor("App");

  return render(Component, {
    onIncrementAll: App.incrementAll,
    onDecrementAll: App.decrementAll,
  });
});
