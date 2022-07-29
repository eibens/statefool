/** LOCALS **/

import * as Core from "./core/mod.ts";

/** MAIN **/

export type CreateOptions<Actors, Stores> = {
  actors: Actors;
  stores: Stores;
  states: Core.StatesOf<Stores>;
};

export function create<Actors, Stores>(
  options: CreateOptions<Actors, Stores>,
) {
  const state = Core.create(options);
  return {
    getActor: <Name extends keyof Actors>(
      name: Name,
    ) => Core.getActor(state, name),
    getModel: <Name extends keyof Stores>(
      name: Name,
    ) => Core.getModel(state, name),
    getStore: <Name extends keyof Stores>(
      name: Name,
    ) => Core.getStore(state, name),
    render: <Props>(
      Component: React.ComponentType<Props>,
      props: Props,
      deps?: unknown[] | ((props: Props) => unknown[]),
    ) => Core.render(state, Component, props, deps),
    update: <Props>(
      Container: React.ComponentType<Props>,
    ) => Core.update(state, Container),
  };
}
