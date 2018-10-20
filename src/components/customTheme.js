import { createMuiTheme } from '@material-ui/core';

export default createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      light: '#232328',
      main: '#232328',
      dark: '#169496',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#42BEC0',
      main: '#42BEC0',
      dark: '#42BEC0',
      contrastText: '#ffffff',
    },
    warning: {
      light: '#c04a42',
      main: '#c04a42',
      dark: '#42BEC0',
      contrastText: '#169496',
    },
  },
});
