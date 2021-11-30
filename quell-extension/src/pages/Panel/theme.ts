import { ThemeOptions, createTheme } from '@material-ui/core/styles';

const themeOptions: ThemeOptions = {
  palette: {
    type: 'dark',
    primary: {
      main: '#3f51b5',
      contrastText: "#fff"
    },
    secondary: {
      main: '#f50057',
    },
  },
};

const theme = createTheme(themeOptions)

export default theme;