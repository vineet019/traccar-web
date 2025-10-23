import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, IconButton, Typography, alpha, useTheme, useMediaQuery } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import MenuIcon from '@mui/icons-material/Menu';
import AppSidebar from '../common/components/AppSidebar';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    background: theme.palette.background.default,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(20px)',
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',
  },
  content: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
}));

const DashboardLayout = () => {
  const { classes } = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box className={classes.root}>
      <AppSidebar
        open={sidebarOpen}
        onToggle={handleSidebarToggle}
        isMobile={isMobile}
      />
      <Box
        className={classes.content}
        sx={{
          marginLeft: !isMobile ? '240px' : 0,
        }}
      >
        {isMobile && (
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleSidebarToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                Traccar GPS Tracking
              </Typography>
            </Toolbar>
          </AppBar>
        )}
        <Box
          component="main"
          className={classes.main}
          sx={{
            pt: isMobile ? 8 : 0,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
