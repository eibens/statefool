/** EXTERNALS **/

import React from "react";

/** LOCALS **/

import { State } from "./state.ts";
import { listen } from "./listen.ts";

/** MAIN **/

export function update<Actors, Stores, Props>(
  state: State<Actors, Stores>,
  Container: React.ComponentType<Props>,
): React.ComponentType<Props> {
  return (props) => {
    const [tick, setTick] = React.useState(0);

    React.useEffect(() => {
      return listen(state, setTick);
    }, []);

    return React.useMemo(() => {
      return React.createElement(Container, props);
    }, [tick, props]);
  };
}
