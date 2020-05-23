import { assocPath } from "ramda";
import { Action } from "light-state-manager";

import { State } from "./state";

interface Payload {
  path: string;
  data: any;
}
export const _updatePageState = new Action<State>().create(
  {
    save: (state, { path, data }: Payload) => {
      const pathList = path ? path.split(".") : [];
      return assocPath(pathList, data)(state) as State;
    },
  },
  (actions, payload: Payload) => {
    actions.save(payload);
  },
);
