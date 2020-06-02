import React, { FC, useCallback, useEffect, useState } from "react";
import { pipe } from "ramda";
import { Container } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { Skeleton } from "@material-ui/lab";
import { observer } from "mobx-react-lite";

import { DataSourceInterface, useDataSource } from "../../HOC/DataSource/DataSourceHOC";
import { ActionsInterface, AdminComponentInterface } from "../../types";
import { buildActions } from "../../componentBuilder/buildActions";
import calculateContextDependency from "../../HOC/Context/calculateContextDependency";
import { buildDependsContext, useAppContext } from "../../context";
import { withPerformance } from "libs/CB/changeDetectionStrategy/withPerformance";

const loadComponent = (type: string, cb: (cmp: any) => void) => {
  import(`commonComponents/${type}`).then((module) => cb(module.default), console.error);
};

interface AdminBlockInterface {
  config: {
    type: string;
    permissions: {
      allow?: string[];
      deny?: string[];
    };
    blocks: any[];
    dataSource: DataSourceInterface<any>;
    actions: ActionsInterface;
    config: any;
    name?: string;
  };
  context: any;
  contextDependsParam: string[];
  updateState: (data: any) => void;
}
const AdminBlock = ({ config, context, updateState }: AdminBlockInterface) => {
  const [Cmp, setCmp] = useState<FC<AdminComponentInterface>>();

  useEffect(() => {
    loadComponent(config.type, setCmp);
    // eslint-disable-next-line
  }, []);

  const data = useDataSource(config.dataSource, {
    context: context,
    updateState,
  });

  const actions = buildActions(config.actions, {
    context: context,
    updateState,
  });

  if (!Cmp) {
    return <Skeleton variant="rect" width="100%" height="100%" />;
  }

  return (
    <Container>
      <Paper elevation={3}>
        <Cmp {...config} context={context} data={data} actions={actions} />
      </Paper>
    </Container>
  );
};

export default pipe(
  () => AdminBlock,
  withPerformance(["contextDependsParam", "updateState"]),
  (Component) => (props: any) => {
    const { context, updateContext } = useAppContext();
    const updateState = useCallback(updateContext, []);
    const context1 = buildDependsContext(props.contextDependsParam, context);
    return (
      <Component
        {...props}
        context={context1}
        contextDependsParam={props.contextDependsParam}
        updateState={updateState}
      />
    );
  },
  observer,
  calculateContextDependency,
)();
