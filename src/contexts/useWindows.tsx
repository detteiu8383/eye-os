import { type ParentComponent, createContext, useContext } from "solid-js";
import { type SetStoreFunction, produce } from "solid-js/store";

import type { WindowDataConcrete } from "../components/window/WindowContent";
import { createLocalStore } from "../lib/createLocalStore";

export type WindowInfo = {
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  linkSceneItemId?: number;
} & WindowDataConcrete;

export interface WindowsContextState {
  windows: WindowInfo[];
}

export type WindowsContextValue = [
  state: WindowsContextState,
  actions: {
    setState: SetStoreFunction<WindowsContextState>;
    setTop: (index: number) => void;
    resetDisplay: () => void;
    addWindow: (windowInfo: WindowInfo) => void;
    removeWindow: (index: number) => void;
  },
];

const defaultState: WindowsContextState = {
  windows: [
    {
      title: "Log",
      icon: "📢",
      minimized: false,
      zIndex: 5,
      x: 250,
      y: 520,
      width: 700,
      height: 350,
      color: "#f5713d",
      type: "log",
      maximized: false,
    },
    {
      title: "Note",
      icon: "📝",
      minimized: false,
      zIndex: 6,
      x: 800,
      y: 320,
      width: 700,
      height: 300,
      color: "#e133e1",
      type: "note",
      option: {
        alignment: "left",
        content:
          'Hello, World!\n- 画面下部の"+"でウィンドウ追加\n- 画面左下の〇ボタンからOBS WebSocket設定',
        fontSize: 32,
      },
      maximized: false,
    },
  ],
};

const WindowsContext = createContext<WindowsContextValue>([
  defaultState,
  {
    setState: () => {},
    setTop: () => {},
    resetDisplay: () => {},
    addWindow: () => {},
    removeWindow: () => {},
  },
]);

export const WindowsProvider: ParentComponent = (props) => {
  const [state, setState] = createLocalStore("windows", defaultState);

  const setTop = (index: number) => {
    // すでに最前面なら何もしない
    if (state.windows[index].zIndex === state.windows.length - 1) return;

    for (let i = 0; i < state.windows.length; i++) {
      if (i === index) {
        setState("windows", i, "zIndex", state.windows.length - 1);
      } else {
        setState("windows", i, "zIndex", (z) => Math.max(0, z - 1));
      }
    }
  };
  const resetDisplay = () => {
    setState("windows", defaultState.windows);
  };
  const addWindow = (windowInfo: WindowInfo) => {
    setState(
      produce((store) => {
        store.windows.push(windowInfo);
      }),
    );
  };
  const removeWindow = (index: number) => {
    setState(
      "windows",
      produce((windows) => {
        windows.splice(index, 1);
        return windows;
      }),
    );
  };

  return (
    <WindowsContext.Provider
      value={[
        state,
        { setState, setTop, resetDisplay, addWindow, removeWindow },
      ]}
    >
      {props.children}
    </WindowsContext.Provider>
  );
};

export const useWindows = () => useContext(WindowsContext);
