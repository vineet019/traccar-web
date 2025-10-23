import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Collapse,
  alpha,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DevicesIcon from '@mui/icons-material/Devices';
import MapIcon from '@mui/icons-material/Map';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import GroupIcon from '@mui/icons-material/Group';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RouteIcon from '@mui/icons-material/Route';
import TimelineIcon from '@mui/icons-material/Timeline';
import PieChartIcon from '@mui/icons-material/PieChart';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { sessionActions } from '../../store';
import { useTranslation } from './LocalizationProvider';
import { nativePostMessage } from './NativeInterface';

const drawerWidth = 280;
const miniDrawerWidth = 80;

const useStyles = makeStyles()((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    width: miniDrawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
  },
  drawerPaper: {
    width: drawerWidth,
    background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 2.5),
    minHeight: 80,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
  logoText: {
    fontWeight: 700,
    fontSize: '1.5rem',
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  userSection: {
    padding: theme.spacing(2, 2.5),
    background: alpha(theme.palette.primary.main, 0.05),
    borderRadius: theme.shape.borderRadius * 2,
    margin: theme.spacing(0, 1.5, 2),
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      background: alpha(theme.palette.primary.main, 0.1),
      transform: 'translateY(-2px)',
    },
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
  listItem: {
    margin: theme.spacing(0.5, 1.5),
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      background: alpha(theme.palette.primary.main, 0.08),
      transform: 'translateX(4px)',
    },
  },
  activeItem: {
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.15)} 100%)`,
    color: theme.palette.primary.main,
    fontWeight: 600,
    '&:hover': {
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.secondary.main, 0.2)} 100%)`,
    },
  },
  subItem: {
    paddingLeft: theme.spacing(7),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
}));

const AppSidebar = ({ open, onToggle, isMobile }) => {
  const { classes } = useStyles();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const t = useTranslation();

  const user = useSelector((state) => state.session.user);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/session', { method: 'DELETE' });
    nativePostMessage('logout');
    navigate('/login');
    dispatch(sessionActions.updateUser(null));
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const menuItems = [
    { id: 'dashboard', label: t('mapTitle') || 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { id: 'map', label: 'Live Tracking', icon: <MapIcon />, path: '/tracking' },
    { id: 'devices', label: t('sharedDevices') || 'Devices', icon: <DevicesIcon />, path: '/settings/devices' },
    { id: 'geofences', label: t('sharedGeofences') || 'Geofences', icon: <LocationOnIcon />, path: '/geofences' },
  ];

  const reportItems = [
    { id: 'combined', label: t('reportCombined') || 'Combined', icon: <AssessmentIcon />, path: '/reports/combined' },
    { id: 'route', label: t('reportRoute') || 'Route', icon: <RouteIcon />, path: '/reports/route' },
    { id: 'trips', label: t('reportTrips') || 'Trips', icon: <TimelineIcon />, path: '/reports/trips' },
    { id: 'summary', label: t('reportSummary') || 'Summary', icon: <PieChartIcon />, path: '/reports/summary' },
  ];

  const settingsItems = [
    { id: 'preferences', label: t('sharedPreferences') || 'Preferences', icon: <SettingsIcon />, path: '/settings/preferences' },
    { id: 'users', label: t('settingsUsers') || 'Users', icon: <GroupIcon />, path: '/settings/users' },
    { id: 'notifications', label: t('sharedNotifications') || 'Notifications', icon: <NotificationsIcon />, path: '/settings/notifications' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile && onToggle) {
      onToggle();
    }
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box className={classes.toolbar}>
        <Box className={classes.logo}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 40,
              height: 40,
            }}
          >
            <MapIcon />
          </Avatar>
          {open && (
            <Typography className={classes.logoText} noWrap>
              Traccar
            </Typography>
          )}
        </Box>
        <IconButton onClick={onToggle} size="small">
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Divider />

      {open && user && (
        <Box className={classes.userSection} onClick={() => handleNavigation(`/settings/user/${user.id}`)}>
          <Box className={classes.userInfo}>
            <Avatar
              sx={{
                bgcolor: 'secondary.main',
                width: 48,
                height: 48,
              }}
            >
              <PersonIcon />
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" fontWeight={600} noWrap>
                {user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <List sx={{ flex: 1, overflow: 'auto', py: 2 }}>
        {menuItems.map((item) => (
          <Tooltip key={item.id} title={!open ? item.label : ''} placement="right">
            <ListItemButton
              className={`${classes.listItem} ${isActive(item.path) ? classes.activeItem : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.label} />}
            </ListItemButton>
          </Tooltip>
        ))}

        <Divider className={classes.divider} />

        <Tooltip title={!open ? 'Reports' : ''} placement="right">
          <ListItemButton
            className={classes.listItem}
            onClick={() => setReportsOpen(!reportsOpen)}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <AssessmentIcon />
            </ListItemIcon>
            {open && (
              <>
                <ListItemText primary={t('reportTitle') || 'Reports'} />
                {reportsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </>
            )}
          </ListItemButton>
        </Tooltip>

        {open && (
          <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {reportItems.map((item) => (
                <ListItemButton
                  key={item.id}
                  className={`${classes.listItem} ${classes.subItem} ${isActive(item.path) ? classes.activeItem : ''}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        )}

        <Tooltip title={!open ? 'Settings' : ''} placement="right">
          <ListItemButton
            className={classes.listItem}
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <SettingsIcon />
            </ListItemIcon>
            {open && (
              <>
                <ListItemText primary={t('settingsTitle') || 'Settings'} />
                {settingsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </>
            )}
          </ListItemButton>
        </Tooltip>

        {open && (
          <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {settingsItems.map((item) => (
                <ListItemButton
                  key={item.id}
                  className={`${classes.listItem} ${classes.subItem} ${isActive(item.path) ? classes.activeItem : ''}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        )}
      </List>

      <Divider />

      <Tooltip title={!open ? t('loginLogout') || 'Logout' : ''} placement="right">
        <ListItemButton
          className={classes.listItem}
          onClick={handleLogout}
          sx={{ my: 1 }}
        >
          <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
            <ExitToAppIcon />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary={t('loginLogout') || 'Logout'}
              sx={{ color: 'error.main' }}
            />
          )}
        </ListItemButton>
      </Tooltip>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? open : true}
      onClose={onToggle}
      className={`${classes.drawer} ${open ? classes.drawerOpen : classes.drawerClose}`}
      classes={{
        paper: classes.drawerPaper,
      }}
      sx={{
        width: open ? drawerWidth : miniDrawerWidth,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : miniDrawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default AppSidebar;
