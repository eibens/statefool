/** LOCALS **/

import * as Core from "./core/mod.ts";
import { Id, StateOf } from "./core/mod.ts";

/** MAIN **/

export type CreateOptions<Actors, Stores> = {
  actors: Actors;
  schema: Stores;
};

export function create<Actors, Stores>(
  options: CreateOptions<Actors, Stores>,
) {
  const state = Core.create(options);
  return {
    getActor: <Name extends keyof Actors>(
      name: Name,
    ) => Core.getActor(state, name),
    getStore: <Name extends keyof Stores>(
      name: Name,
      id: string,
    ) => Core.getStore(state, name, id),
    getStores: <Name extends keyof Stores>(
      name: Name,
    ) => Core.getStores(state, name),
    insert: <Name extends keyof Stores>(
      name: Name,
      id: Id,
      data: StateOf<Stores[Name]>,
    ) => Core.insert(state, name, id, data),
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
