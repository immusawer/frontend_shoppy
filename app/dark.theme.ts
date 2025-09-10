"use client";
import { createTheme } from "@mui/material";

const darktheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2", // Main primary color (blue)
      light: "#63a4ff", // Lighter blue
      dark: "#004ba0", // Darker blue
    },
    secondary: {
      main: "#f50057", // Main secondary color (pink)
      light: "#ff4081", // Lighter pink
      dark: "#c51162", // Darker pink
    },
    background: {
      default: "#121212", // Dark background for body
      paper: "#1e1e1e", // Dark background for paper/card elements
    },
    text: {
      primary: "#e0e0e0", // Light gray text for better readability
      secondary: "#b0b0b0", // Secondary text color
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
      color: "#e0e0e0",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      color: "#e0e0e0",
    },
    body1: {
      fontSize: "1rem",
      color: "#b0b0b0", // Body text color
    },
    button: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px", // Rounded buttons
          padding: "8px 16px", // Button padding
          textTransform: "none", // Keep button text case as is
        },
        contained: {
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)", // Button shadow
          "&:hover": {
            backgroundColor: "#1565c0", // Darker primary blue on hover
          },
        },
        outlined: {
          borderColor: "#1976d2", // Blue border for outlined buttons
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.1)", // Light blue on hover
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: "#333333", // Darker input background
          borderRadius: "8px", // Rounded input fields
          "& .MuiInputBase-root": {
            color: "#e0e0e0", // Input text color
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2", // Blue border for inputs
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e", // Dark background for cards
          borderRadius: "12px", // Rounded card corners
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Card shadow
        },
      },
    },
  },
});

export default darktheme;
