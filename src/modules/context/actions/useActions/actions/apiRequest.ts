import { Container } from "typedi";

import { RequestManager } from "libs/request";
import { identityValueDecoder } from "libs/request/defaultDecoders";
import { prepareApiRequestBody } from "libs/requestLibs";

import { insertContext } from "modules/context/insertContext";
import { AppContextStateInterface } from "modules/context/hooks/useAppContext";

import { ActionInputDataInterface } from "../types";

import { ActionOptions, ActionType } from "types/Actions";

const requestManager = Container.get(RequestManager);

export default function apiRequest(
  appContext: AppContextStateInterface,
  actionOptions: ActionOptions[ActionType.API_REQUEST],
  inputData: ActionInputDataInterface,
): Promise<any> {
  const { method, body, reference, removeEmptyString = true } = actionOptions;
  const makeRequest = requestManager.createRequest(
    insertContext(reference, appContext, inputData).value,
    method,
    identityValueDecoder,
  );

  return makeRequest({
    body: insertContext({ ...prepareApiRequestBody({ removeEmptyString }, body), ...inputData }, appContext, inputData)
      .value,
  });
}
