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

const drawerWidth = 240;

const useStyles = makeStyles()((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    background: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2.5, 2),
    minHeight: 64,
  },
  logoText: {
    fontWeight: 600,
    fontSize: '1.125rem',
    letterSpacing: '-0.02em',
    color: theme.palette.text.primary,
  },
  listItem: {
    margin: theme.spacing(0.25, 1),
    borderRadius: 8,
    padding: theme.spacing(1, 1.5),
    transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      background: alpha(theme.palette.action.hover, 0.04),
    },
  },
  activeItem: {
    background: theme.palette.action.selected,
    color: theme.palette.secondary.main,
    fontWeight: 500,
    '&:hover': {
      background: theme.palette.action.selected,
    },
  },
  subItem: {
    paddingLeft: theme.spacing(5),
  },
  icon: {
    minWidth: 36,
    color: 'inherit',
  },
  divider: {
    margin: theme.spacing(1.5, 2),
    borderColor: theme.palette.divider,
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
        <Typography className={classes.logoText}>
          Traccar
        </Typography>
        {isMobile && (
          <IconButton onClick={onToggle} size="small" edge="end">
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      <Divider className={classes.divider} />

      <List sx={{ flex: 1, overflow: 'auto', py: 0 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.id}
            className={`${classes.listItem} ${isActive(item.path) ? classes.activeItem : ''}`}
            onClick={() => handleNavigation(item.path)}
          >
            <ListItemIcon className={classes.icon}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.9375rem',
                fontWeight: isActive(item.path) ? 500 : 400,
              }}
            />
          </ListItemButton>
        ))}

        <Divider className={classes.divider} />

        <ListItemButton
          className={classes.listItem}
          onClick={() => setReportsOpen(!reportsOpen)}
        >
          <ListItemIcon className={classes.icon}>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText
            primary={t('reportTitle') || 'Reports'}
            primaryTypographyProps={{ fontSize: '0.9375rem' }}
          />
          {reportsOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </ListItemButton>

        <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {reportItems.map((item) => (
              <ListItemButton
                key={item.id}
                className={`${classes.listItem} ${classes.subItem} ${isActive(item.path) ? classes.activeItem : ''}`}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon className={classes.icon}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive(item.path) ? 500 : 400,
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Collapse>

        <ListItemButton
          className={classes.listItem}
          onClick={() => setSettingsOpen(!settingsOpen)}
        >
          <ListItemIcon className={classes.icon}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText
            primary={t('settingsTitle') || 'Settings'}
            primaryTypographyProps={{ fontSize: '0.9375rem' }}
          />
          {settingsOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </ListItemButton>

        <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {settingsItems.map((item) => (
              <ListItemButton
                key={item.id}
                className={`${classes.listItem} ${classes.subItem} ${isActive(item.path) ? classes.activeItem : ''}`}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon className={classes.icon}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive(item.path) ? 500 : 400,
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>

      <Divider className={classes.divider} />

      <List sx={{ pb: 2 }}>
        <ListItemButton
          className={classes.listItem}
          onClick={handleLogout}
        >
          <ListItemIcon sx={{ color: 'error.main', minWidth: 36 }}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText
            primary={t('loginLogout') || 'Logout'}
            primaryTypographyProps={{ fontSize: '0.9375rem' }}
            sx={{ color: 'error.main' }}
          />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? open : true}
      onClose={onToggle}
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default AppSidebar;
