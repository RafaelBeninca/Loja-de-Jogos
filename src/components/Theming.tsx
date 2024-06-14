import { createTheme } from "@mui/material/styles";
// import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import "../styles/index.css";

/* Cores padrões da nossa logo: */
/* Verde: #29524A */
/* Roxo: #20275A */

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#20275A",
    },
    // background: {
    //   default: "#000"
    // },
    secondary: {
      main: "#29524A",
    },
  },
  typography: {
    fontFamily: "Hammersmith One",
    fontSize: 12,
    fontWeightRegular: 400,
    h1: {
      fontFamily: "Hammersmith One",
      fontSize: 36,
      fontWeightRegular: 400,
      color: "#000",
    },
    h2: {
      fontFamily: "Hammersmith One",
      fontSize: 24,
      fontWeightRegular: 400,
      color: "#000",
    },
    h3: {
      fontFamily: "Hammersmith One",
      fontSize: 18,
      fontWeightRegular: 400,
      color: "#000",
    },
    subtitle1: {
      fontFamily: "Hammersmith One",
      fontSize: 20,
      fontWeightRegular: 400,
      color: "#000",
    },
  },
  components: {
    //   MuiTextField: {
    //     styleOverrides: {
    //       root: {
    //         '--TextField-brandBorderColor': '#E0E3E7',
    //         '--TextField-brandBorderHoverColor': '#B2BAC2',
    //         '--TextField-brandBorderFocusedColor': '#6F7E8C',
    //         '& label.Mui-focused': {
    //           color: 'var(--TextField-brandBorderFocusedColor)',
    //         },
    //       },
    //     },
    //   },
    //   MuiOutlinedInput: {
    //     styleOverrides: {
    //       notchedOutline: {
    //         borderColor: 'var(--TextField-brandBorderColor)',
    //       },
    //       root: {
    //         [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
    //           borderColor: 'var(--TextField-brandBorderHoverColor)',
    //         },
    //         [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
    //           borderColor: 'var(--TextField-brandBorderFocusedColor)',
    //         },
    //       },
    //     },
    //   },
    //   MuiFilledInput: {
    //     styleOverrides: {
    //       root: {
    //         '&::before, &::after': {
    //           borderBottom: '2px solid var(--TextField-brandBorderColor)',
    //         },
    //         '&:hover:not(.Mui-disabled, .Mui-error):before': {
    //           borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
    //         },
    //         '&.Mui-focused:after': {
    //           borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
    //         },
    //       },
    //     },
    //   },
    MuiInput: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #fff',
          color: "#fff",
        },
      }
    },
  },
});

declare module "@mui/material/styles" {
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
