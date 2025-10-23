export default {
  MuiUseMediaQuery: {
    defaultProps: {
      noSsr: true,
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 8,
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.text.secondary,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderWidth: 1,
          borderColor: theme.palette.secondary.main,
        },
      }),
      notchedOutline: ({ theme }) => ({
        borderColor: theme.palette.divider,
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '10px 20px',
        fontWeight: 500,
        textTransform: 'none',
        fontSize: '0.9375rem',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      sizeMedium: {
        height: '44px',
      },
      contained: ({ theme }) => ({
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      }),
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
      elevation0: {
        boxShadow: 'none',
      },
      elevation1: {
        boxShadow: 'none',
      },
      elevation2: {
        boxShadow: 'none',
      },
      elevation3: {
        boxShadow: 'none',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
      },
    },
  },
  MuiFormControl: {
    defaultProps: {
      size: 'small',
    },
  },
  MuiSnackbar: {
    defaultProps: {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
    },
  },
  MuiTooltip: {
    defaultProps: {
      enterDelay: 500,
      enterNextDelay: 500,
    },
    styleOverrides: {
      tooltip: ({ theme }) => ({
        borderRadius: 6,
        padding: '6px 12px',
        fontSize: '0.8125rem',
        fontWeight: 500,
        background: theme.palette.text.primary,
      }),
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        '@media print': {
          color: theme.palette.alwaysDark.main,
        },
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: '12px 16px',
      }),
      head: ({ theme }) => ({
        fontWeight: 600,
        fontSize: '0.8125rem',
        color: theme.palette.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }),
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
      },
    },
  },
};
