import { styled } from "@macaron-css/solid";

import { semanticColors } from "../../theme/color";
import { type WindowData } from "../windows/WindowContent";

export interface EmptyWindowData extends WindowData {
  type: "empty";
}

export const defaultEmptyWindowData: EmptyWindowData = {
  type: "empty",
};

const Empty = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    background: semanticColors.ui.background,
  },
});

export default Empty;
