import { Accessor, createContext, ParentComponent, useContext } from "solid-js";
import { DragHandler } from "./DragHandler";
import useControllableState from "@renderer/lib/controllable-state";
import { DOMElement } from "solid-js/jsx-runtime";
import { clamp } from "@renderer/lib/tungsten/math";

const DEFAULT_RESIZABLE_PANEL_VALUE = 100;
const DEFAULT_MIN = 0;
const DEFAULT_MAX = Infinity;

type Event = PointerEvent & {
  currentTarget: HTMLDivElement;
  target: DOMElement;
};

export type Props = {
  min?: number;
  max?: number;

  offsetFromPanel?: number;

  defaultValue?: number;
  value?: Accessor<number>;
  onValueChange?: (newValue: number) => void;
  onValueCommit?: (value: number) => void;
  onValueStart?: () => void;
};

export type Context = ReturnType<typeof useProviderValue>;
function useProviderValue(props: Props) {
  let startDragValue: number | undefined;
  const [value, setValue] = useControllableState({
    defaultProp: props.defaultValue ?? DEFAULT_RESIZABLE_PANEL_VALUE,
    prop: props.value,
    onChange: props.onValueChange,
  });

  const getValueFromPointer = (pointerPosition: number) => {
    if (!startDragValue) {
      return;
    }

    const min = props.min ?? DEFAULT_MIN;
    const max = props.max ?? DEFAULT_MAX;

    const value = pointerPosition - (props.offsetFromPanel ?? 0);
    return clamp(min, max, value);
  };

  const handlePointerStart = (event: Event) => {
    startDragValue = value();
    const newValue = getValueFromPointer(event.clientX);
    if (typeof newValue === "undefined") {
      return;
    }

    setValue(newValue);
    props.onValueStart?.();
  };
  const handlePointerMove = (event: Event) => {
    const newValue = getValueFromPointer(event.clientX);
    if (typeof newValue === "undefined") {
      return;
    }

    setValue(newValue);
  };
  const handlePointerEnd = () => {
    props.onValueCommit?.(value());
  };

  return { value, handlePointerStart, handlePointerMove, handlePointerEnd };
}

export const ResizablePanelContext = createContext<Context>();
const ResizablePanelRoot: ParentComponent<Props> = (props) => {
  const value = useProviderValue(props);
  return (
    <ResizablePanelContext.Provider value={value}>{props.children}</ResizablePanelContext.Provider>
  );
};

export function useResizablePanel(): Context {
  const state = useContext(ResizablePanelContext);
  if (!state) {
    throw new Error(
      "useResizablePanel needs to be used inisde of the `ResizablePanelContext` component.",
    );
  }
  return state;
}

const ResizablePanel = Object.assign(ResizablePanelRoot, {
  DragHandler,
});

export default ResizablePanel;
