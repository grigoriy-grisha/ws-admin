import { METHODS } from "libs/request";

export enum DataSourceType {
  STATIC = "static",
  API_REQUEST = "api:request",
  CONTEXT = "context",
}

type DataSourceOptions = {
  [DataSourceType.STATIC]: any;
  [DataSourceType.CONTEXT]: { key: string };
  [DataSourceType.API_REQUEST]: {
    reference: string;
    method: METHODS;
    responseDataConverter?: string;
    removeEmptyString?: boolean;
    removeNullableFields?: boolean;
    params?: {
      [key: string]: string | number;
    };
  };
};

export interface DataSourceInterface<T extends DataSourceType> {
  type: T;
  options: DataSourceOptions[T];
  context?: string;
}

export type ContainsDataSourceInterface<DataSource> = {
  dataSource: DataSource;
};

export type AnyDataSource =
  | DataSourceInterface<DataSourceType.API_REQUEST>
  | DataSourceInterface<DataSourceType.CONTEXT>
  | DataSourceInterface<DataSourceType.STATIC>;
