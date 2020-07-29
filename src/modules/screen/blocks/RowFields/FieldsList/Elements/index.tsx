import React from "react";

import ImageWithDefault from "primitives/ImageWithDefault";

import { border, borderRadius } from "libs/styles";

import SimpleText from "modules/screen/blocks/SimpleText";
import { insertContext } from "modules/context/insertContext";
import { useAppContext } from "modules/context/hooks/useAppContext";

import { FieldListItemType } from "../types";

interface FieldItemElementRendererInterface {
  styles?: any;
  options: Record<string, any>;
  type: FieldListItemType;
}

const matchesFieldItemAndType: Record<FieldListItemType, (props: { options: any; styles?: any }) => JSX.Element> = {
  [FieldListItemType.text]: ({ options, styles }) => <SimpleText styles={styles} options={options} />,
  [FieldListItemType.image]: ({ options, styles }) => {
    const reference = insertContext(options.reference, useAppContext().context);
    return (
      <ImageWithDefault
        styles={[styles, borderRadius(6), border(1, "gray-blue/02")]}
        src={reference.value}
        width="100%"
        aspectRatio={options.aspectRatio}
      />
    );
  },
};

function FieldItemElementRenderer({ options, styles, type }: FieldItemElementRendererInterface) {
  if (!type) return null;
  const Component = matchesFieldItemAndType[type];
  return <Component options={options} styles={styles} />;
}

export default React.memo(FieldItemElementRenderer);
