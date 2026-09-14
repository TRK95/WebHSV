import { createTheme } from "@mui/material";
import { themeOptions } from ".";

const darkTheme = createTheme({
  ...themeOptions,
  palette: {
    mode: 'light'
  }
});

export default darkTheme;