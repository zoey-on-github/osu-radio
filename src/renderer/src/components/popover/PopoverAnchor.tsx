import { Component, JSX } from "solid-js";
import { usePopover } from "./Popover";

export type PopoverAnchorProps = JSX.IntrinsicElements["div"];
const PopoverAnchor: Component<PopoverAnchorProps> = (props) => {
  const state = usePopover();
  return <div ref={state.setTriggerRef} {...props} />;
};

export default PopoverAnchor;
