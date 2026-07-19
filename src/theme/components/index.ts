import { BaseTheme } from "../types";
import createButtonStyles from "./button";
import createCardStyles from "./card";
import createIconStyles from "./icon";
import createInputStyles from "./input";
import createTextStyles from "./text";

const createComponentStyles = (theme: BaseTheme) => ({
  card: createCardStyles(theme),
  button: createButtonStyles(theme),
  input: createInputStyles(theme),
  icon: createIconStyles(theme),
  text: createTextStyles(theme),
});

export default createComponentStyles;
