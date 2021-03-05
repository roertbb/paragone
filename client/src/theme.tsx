import { theme as chakraTheme } from "@chakra-ui/core";

const theme = {
  ...chakraTheme,
  colors: {
    ...chakraTheme.colors,
  },
  fonts: { ...chakraTheme.fonts, mono: `monospace` },
  breakpoints: ["40em", "52em", "64em"],
  icons: {
    ...chakraTheme.icons,
  },
};

export default theme;
