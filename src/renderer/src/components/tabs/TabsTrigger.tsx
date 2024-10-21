import { useTabs } from "./Tabs";
import { cn } from "@renderer/lib/css.utils";
import { Component, splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

export type Props = JSX.IntrinsicElements["button"] & {
  value: string;
  onSelectedByClick?: () => void;
};
const TabsTrigger: Component<Props> = (_props) => {
  const [props, rest] = splitProps(_props, ["value", "onSelectedByClick", "class"]);
  const { attrs, isSelected, tabIndex } = useTabs().item(props.value, {
    onSelectedByClick: props.onSelectedByClick,
  });
  return (
    <button
      data-selected={isSelected()}
      tabIndex={tabIndex()}
      {...attrs}
      {...rest}
      class={cn(
        "ring-offset-background focus-visible:ring-ring z-10 flex h-8 items-center gap-2 rounded-lg px-3 text-subtext focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        props.class,
      )}
    />
  );
};

export default TabsTrigger;
