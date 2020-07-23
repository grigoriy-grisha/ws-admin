import React from "react";
import { observer } from "mobx-react-lite";
import { assoc, assocPath } from "ramda";
import { useSetState } from "react-use";

import Wrapper from "primitives/Wrapper";
import Spinner from "primitives/Spinner";
import Dropdown, { DropdownSize } from "primitives/Dropdown";

import Pagination from "components/Pagination/Pagination";

import {
  ai,
  Aligns,
  border,
  borderRadius,
  borderTop,
  flex,
  flexColumn,
  flexValue,
  fullWidth,
  jc,
  marginTop,
  overflowX,
  overflowY,
  padding,
} from "libs/styles";
import { useLocalStorage } from "libs/hooks";

import TableViewBlock from "../Table";
import CardsViewBlock from "../Cards";
import { ViewMetaData } from "../types";

import { FormattedDataViewInterface } from "./types";
import Actions from "./Components/Actions";
import { notFoundElement } from "./Components/notFound";
import { formattedDataLocalStorageInitialValue, usePagination } from "./libs";

const initialMetaData: ViewMetaData = {
  loading: true,
  pagination: { itemsCount: 0, pagesCount: 0 },
};

function FormattedDataView({ options, actions, styles }: FormattedDataViewInterface) {
  const [localStorageValue, setLocalStorageValue] = useLocalStorage(options!.id, formattedDataLocalStorageInitialValue);

  const [metaData, setMetaData] = useSetState(initialMetaData);

  const { actions: paginationViewActions, data: paginationViewData, show: showPaginationRaw } = usePagination(
    options!.paginationView,
  );

  const tableViewOptions = React.useMemo(
    () => assocPath(["options", "id"], `${options!.id}-table`, options!.tableView),
    [],
  );

  if (paginationViewData.loadingContainer.loading) return null;

  const itemsIsEmptyList = metaData.pagination!.itemsCount === 0;

  const showPagination = !itemsIsEmptyList && showPaginationRaw;

  const notFound = !metaData.loading && itemsIsEmptyList && notFoundElement;

  const isCardsView = localStorageValue.mode === "cards";

  return (
    <Wrapper
      styles={[flex, ai(Aligns.STRETCH), flexValue(1), borderRadius(8), border(1, "gray-blue/02"), flexColumn, styles]}
    >
      <Actions
        options={options}
        actions={actions}
        isCardsView={isCardsView}
        storage={localStorageValue}
        setStorage={setLocalStorageValue}
        paginationElement={
          showPagination && (
            <Dropdown
              size={DropdownSize.MEDIUM}
              items={options!.paginationView.options?.paginationItems.map((number) => ({ id: number, title: number }))}
              selectedItemId={paginationViewData.data!.perPage}
              onChange={async (value) => {
                await paginationViewActions.change.run({
                  page: 1,
                  perPage: value,
                });
                setLocalStorageValue({ ...localStorageValue, perPage: value as number });
              }}
            />
          )
        }
      />
      {metaData.loading && <Spinner />}
      {isCardsView ? (
        <Wrapper styles={[fullWidth, marginTop(20), flexValue(1), overflowY("scroll")]}>
          {notFound}
          <CardsViewBlock {...options!.cardsView} onUpdateMeta={setMetaData} />
        </Wrapper>
      ) : (
        <Wrapper styles={[fullWidth, marginTop(8), flex, overflowX("auto"), flexValue(1)]}>
          {notFound}
          <TableViewBlock {...tableViewOptions} onUpdateMeta={setMetaData} />
        </Wrapper>
      )}
      {showPagination && (
        <Wrapper styles={[flex, jc(Aligns.END), padding(16), borderTop(1, "gray-blue/02")]}>
          <Pagination
            perPage={paginationViewData.data!.perPage}
            elementsCount={metaData.pagination!.itemsCount}
            onChange={(page) => {
              paginationViewActions.change.run(assoc("page", page, paginationViewData.data!));
            }}
          />
        </Wrapper>
      )}
    </Wrapper>
  );
}

export default React.memo(observer(FormattedDataView));
