import { Icons } from "../../../../../primitives/Icon";

import { PaginationMeta } from "types/Pagination";
import { AnyAction } from "types/Actions";

export enum TableViewDataType {
  STRING = "STRING",
  IMAGE = "IMAGE",
}

export enum TableSizes {
  LARGE = "LARGE",
  MEDIUM = "MEDIUM",
  SMALL = "SMALL",
}

export type TableViewColumn = {
  title: string;
  field: string;
  type?: TableViewDataType;
  referenceRedirect?: string;
  resizable?: boolean;
  sortable?: boolean;
  options?: {
    imageConfig?: {
      heightConfig: TableSizes;
      aspectRatio: number;
    };
  };
};

export type TableViewRowsConfig = {
  paddingConfig: TableSizes;
};

export interface TableViewOptions {
  selectable: boolean;
  columns: TableViewColumn[];
  rowsConfig: TableViewRowsConfig;
  id: string;
}

export interface TableViewItemInterface {
  value: string | number;
  icon?: Icons;
}

export interface TableViewDataSource {
  pagination: PaginationMeta;
  list: Record<string, TableViewItemInterface>[];
}
