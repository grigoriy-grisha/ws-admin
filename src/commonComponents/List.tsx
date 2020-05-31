import React, { useState } from "react";
import MaterialTable from "material-table";

import { AdminComponentInterface } from "../modules/adminModule/types";

interface ListInterface extends AdminComponentInterface {
  // name: string;
}
const List = ({ data, actions }: ListInterface) => {
  const [state, setState] = useState<{
    columns: {
      title: string;
      field: string;
      type?: string;
      lookup?: { [key: number]: string };
    }[];
    data: { [key: string]: any }[];
  }>(data);

  return (
    <MaterialTable
      title="Editable Example"
      columns={state.columns as any}
      data={state.data}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve, reject) => {
            actions.create(newData).then(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.push(newData);
                return { ...prevState, data };
              });
            }, reject);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              if (oldData) {
                setState((prevState) => {
                  const data = [...prevState.data];
                  data[data.indexOf(oldData)] = newData;
                  return { ...prevState, data };
                });
              }
            }, 600);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve, reject) => {
            actions.delete(oldData).then(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.splice(data.indexOf(oldData), 1);
                return { ...prevState, data };
              });
            }, reject);
          }),
      }}
    />
  );
};

export default React.memo(List);
