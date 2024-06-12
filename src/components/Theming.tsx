import { createTheme } from '@mui/material/styles';
import '../styles/index.css'

/* Cores padrões da nossa logo: */
/* Verde: #29524A */
/* Roxo: #20275A */

const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
          main: '#20275A' ,
      },
      secondary: {
          main: '#29524A',
      },
    },
    typography: {
      fontFamily: "Hammersmith One",
      fontSize: 12,
      fontWeightRegular: 400,
      h1: {
        fontFamily: "Hammersmith One",
        fontSize: 50,
        fontWeightRegular: 400,
        color: '#fff'
      },
      subtitle1: {
        fontFamily: "Hammersmith One",
        fontSize: 20,
        fontWeightRegular: 400,
        color: '#fff'
      }
    },
});

declare module '@mui/material/styles' {
    interface Theme {
      status: {
        danger: string;
      };
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
      status?: {
        danger?: string;
      };
    }
  }

export default theme;