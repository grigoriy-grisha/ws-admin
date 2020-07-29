import "reflect-metadata";
import React, { useEffect } from "react";
import { Container } from "typedi";
import { observer } from "mobx-react-lite";

import Spinner from "primitives/Spinner";

import { useSetDocumentTitle } from "libs/hooks";

import ToastReceiver from "modules/ToastReceiver";
import AuthModule from "modules/auth";
import { AuthTokenSaver } from "modules/auth/authTokenSaver";
import BlockRenderer from "modules/screen/BlockRenderer";

import Layout from "./layout";
import RedirectToMainReference from "./InitialRedirect";

import { SystemState } from "state/systemState";

const systemState = Container.get(SystemState);

function App() {
  useEffect(() => {
    systemState.loadConfig().then(() => {
      const { userAuthenticate } = systemState.stateContainer.state;
      if (!userAuthenticate.authTokenSaveStrategy) return;
      new AuthTokenSaver(userAuthenticate.authTokenSaveStrategy).runDefaultTokenPipeline();
    });
  }, []);
  useSetDocumentTitle(systemState.stateContainer.state.title || "Административная панель");

  if (systemState.stateContainer.empty) {
    return <Spinner size={132} />;
  }

  const state = systemState.stateContainer.state;

  return (
    <>
      <AuthModule>
        <Layout logo={state.logo} sidebarDataSource={state.sideMenu.dataSource}>
          <BlockRenderer {...state.mainBlock} />
          <RedirectToMainReference />
        </Layout>
      </AuthModule>
      <ToastReceiver />
    </>
  );
}

export default React.memo(observer(App));
