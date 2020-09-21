import { BaseError } from "libs/BaseError";
import { EventEmitter } from "libs/events";
import { ProgressContainer } from "libs/ProgressContainer";

import { AppContextInterface } from "modules/context/hooks/useAppContext";

import { ActionEventEmitterEvents, ActionInputDataInterface } from "../../types";

import { LoadingContainer } from "state/loadingContainer";

import { RealAnyRawAction } from "types/Actions";

export const connectActionFunctionAndAppContext = (
  action: RealAnyRawAction,
  actionFunction: (inputData: ActionInputDataInterface) => Promise<any>,
  appContext: AppContextInterface,
) => {
  const loadingContainer = new LoadingContainer();
  const progressContainer = new ProgressContainer();
  const eventEmitter = new EventEmitter<ActionEventEmitterEvents>();

  eventEmitter.on("PROGRESS", progressContainer.setProgress);

  const run = (inputData: any, previousActionOutput?: any) => {
    loadingContainer.clearErrors();
    loadingContainer.startLoading();
    eventEmitter.emit("PROGRESS", 0);
    return actionFunction({ inputData, previousActionOutput, eventEmitter })
      .then((actionOutputData) => {
        loadingContainer.stopLoading();
        if (action.context) appContext.updateState({ path: action.context, data: actionOutputData });
        return actionOutputData;
      })
      .catch((baseError: BaseError) => {
        console.log("Action error", baseError);
        const { error } = baseError;
        loadingContainer.setErrors(error.errors);
        loadingContainer.setDefaultError(error.message);
        loadingContainer.stopLoading();
        throw baseError;
      })
      .finally(() => {
        eventEmitter.removeListener("PROGRESS", progressContainer.setProgress);
      });
  };

  const discard = () => {
    eventEmitter.emit("DISCARD", null);
  };

  return {
    loadingContainer,
    run,
    discard,
    progressContainer,
    type: action.type,
  };
};
