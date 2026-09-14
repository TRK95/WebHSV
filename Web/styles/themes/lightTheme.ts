import { createTheme } from "@mui/material";
import { themeOptions } from ".";

const lightTheme = createTheme({
  ...themeOptions,
  palette: {
    mode: "light"
  }
});

export default lightTheme;