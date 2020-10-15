import React from "react";
import { observer } from "mobx-react-lite";
import { mergeRight } from "ramda";

import Wrapper from "primitives/Wrapper";
import Editor from "primitives/Editor";
import RadioGroup, { RadioGroupSize } from "primitives/RadioGroup";
import { Icons } from "primitives/Icon";
import { ListItemInterface } from "primitives/List/ListItem";

import { Aligns, backgroundColor, flex, fullWidth, jc, marginLeft, minHeight } from "libs/styles";
import { convertNativeFileToFileInterface } from "libs/hooks/files/helpers/createFileInput";

import { useAppContext } from "modules/context/hooks/useAppContext";
import { useDataSource } from "modules/context/dataSource/useDataSource";
import { useActions } from "modules/context/actions/useActions";
import globalEventBus from "modules/globalEventBus";

import BlocksList from "../BlocksList";
import { useStateFromContext } from "../../../context/insertContext";

import { editorStyles } from "./editorStyles";

import { BlockInterface } from "state/globalState";

interface HTMLEditorOptionsInterface {
  value: string;
  buttonOptions?: { icon: Icons };
  listItems?: ListItemInterface<any>[];
  blocks?: BlockInterface[];
  visibilityMode: { contextPath: string };
}

const items = [
  { code: "0", title: "Редактор" },
  { code: "1", title: "Превью" },
];

function HTMLEditor({
  options,
  dataSource,
  actions,
}: BlockInterface<HTMLEditorOptionsInterface, "change" | "upload" | "preview">) {
  if (!actions?.change) return null;
  if (!actions?.upload) return null;
  if (!dataSource) return null;
  if (!options) return null;

  const appContext = useAppContext();
  const resultActions = useActions(actions, appContext);
  const { data } = useDataSource(dataSource!);
  const [isPreviewMode] = useStateFromContext(options.visibilityMode.contextPath, appContext);
  const [radioValue, setRadioValue] = React.useState(() => items[0].code);

  React.useEffect(() => {
    if (isPreviewMode) return;
    setRadioValue(items[0].code);
  }, [isPreviewMode]);

  function toggleMode(code: string) {
    setRadioValue(code);
    resultActions.preview.run(code);
  }

  async function uploadFile(file: File) {
    try {
      const uploadedFile = await resultActions.upload.run(convertNativeFileToFileInterface(file));
      return mergeRight(file, uploadedFile);
    } catch (err) {
      globalEventBus.emit("ADD_TOAST", { error: true, text: err.getErrorOrMessage() });
    }
  }

  return (
    <Wrapper
      styles={[fullWidth, minHeight("100%"), backgroundColor("gray-blue/01"), flex, jc(Aligns.CENTER), editorStyles]}
    >
      <Editor
        initialText={data}
        onChange={(data) => {
          resultActions.change.run(data);
        }}
        uploader={uploadFile}
        additionalToolbarElements={{
          beforeLastSeparator: options.blocks && <BlocksList blocks={options.blocks} />,
          atTheEndOfContainer: (
            <Wrapper styles={[marginLeft(25)]}>
              <RadioGroup size={RadioGroupSize.SMALL} active={radioValue} onChange={toggleMode} items={items} />
            </Wrapper>
          ),
        }}
      />
    </Wrapper>
  );
}

export default React.memo(observer(HTMLEditor));
