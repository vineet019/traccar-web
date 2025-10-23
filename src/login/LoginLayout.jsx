import { useMediaQuery, Paper, Box } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTheme } from '@mui/material/styles';
import LogoImage from './LogoImage';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    background: theme.palette.background.default,
  },
  sidebar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.palette.text.primary,
    width: '50%',
    position: 'relative',
    [theme.breakpoints.down('lg')]: {
      width: '40%',
    },
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  logoContainer: {
    position: 'relative',
    zIndex: 1,
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: theme.spacing(4),
    background: theme.palette.background.default,
  },
  form: {
    width: '100%',
    maxWidth: 440,
  },
}));

const LoginLayout = ({ children }) => {
  const { classes } = useStyles();
  const theme = useTheme();

  return (
    <main className={classes.root}>
      <div className={classes.sidebar}>
        <Box className={classes.logoContainer}>
          <LogoImage color="#ffffff" />
        </Box>
      </div>
      <Box className={classes.paper}>
        <form className={classes.form}>
          {children}
        </form>
      </Box>
    </main>
  );
};

export default LoginLayout;
