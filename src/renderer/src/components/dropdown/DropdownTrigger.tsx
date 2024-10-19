import Popover from "../popover/Popover";
import { ChevronDownIcon } from "lucide-solid";
import { Component, JSX } from "solid-js";

type Props = JSX.IntrinsicElements["button"];
const DropdownTrigger: Component<Props> = (props) => {
  return (
    <Popover.Trigger class="focus-visible:ring-ring flex items-center gap-2 rounded-full border-solid border-stroke px-4 py-0.5 hover:bg-surface focus-visible:ring-2 focus-visible:ring-offset-2">
      <ChevronDownIcon size={20} class="text-subtext" />
      <span class="text-sm">{props.children}</span>
    </Popover.Trigger>
  );
};

export default DropdownTrigger;
