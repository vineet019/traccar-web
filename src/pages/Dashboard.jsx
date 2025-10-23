import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  Typography,
  Paper,
  alpha,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpeedIcon from '@mui/icons-material/Speed';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import MainMap from '../main/MainMap';
import DeviceList from '../main/DeviceList';

const useStyles = makeStyles()((theme) => ({
  root: {
    padding: theme.spacing(4),
    height: '100%',
    overflow: 'auto',
  },
  statCard: {
    height: '100%',
    padding: theme.spacing(3),
    borderRadius: 16,
    border: `1px solid ${theme.palette.divider}`,
    background: alpha(theme.palette.background.paper, 0.6),
    backdropFilter: 'blur(20px)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 12px 24px ${alpha(theme.palette.common.black, 0.08)}`,
    },
  },
  statValue: {
    fontSize: '3rem',
    fontWeight: 600,
    lineHeight: 1,
    marginBottom: theme.spacing(0.5),
    letterSpacing: '-0.02em',
  },
  statLabel: {
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: theme.palette.text.secondary,
    letterSpacing: '0.01em',
    textTransform: 'uppercase',
  },
  mapContainer: {
    height: 480,
    borderRadius: 16,
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.paper,
  },
  deviceListContainer: {
    height: 480,
    borderRadius: 16,
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,
    background: alpha(theme.palette.background.paper, 0.6),
    backdropFilter: 'blur(20px)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    marginBottom: theme.spacing(2),
  },
}));

const StatCard = ({ icon, value, label, color }) => {
  const { classes } = useStyles();

  return (
    <Card className={classes.statCard} elevation={0}>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: alpha(color, 0.1),
          color: color,
          marginBottom: 2,
        }}
      >
        {icon}
      </Box>
      <Typography className={classes.statValue}>{value}</Typography>
      <Typography className={classes.statLabel}>{label}</Typography>
    </Card>
  );
};

const Dashboard = () => {
  const { classes } = useStyles();
  const devices = useSelector((state) => state.devices.items);
  const positions = useSelector((state) => state.session.positions);

  const filteredDevices = useMemo(() => Object.values(devices), [devices]);
  const filteredPositions = useMemo(() => Object.values(positions), [positions]);

  const stats = useMemo(() => {
    const deviceArray = Object.values(devices);
    const total = deviceArray.length;
    const online = deviceArray.filter((d) => d.status === 'online').length;
    const offline = deviceArray.filter((d) => d.status === 'offline').length;
    const moving = Object.values(positions).filter((p) => p.speed > 0).length;

    return { total, online, offline, moving };
  }, [devices, positions]);

  return (
    <Box className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={6} sm={3}>
          <StatCard
            icon={<DirectionsCarIcon fontSize="large" />}
            value={stats.total}
            label="Devices"
            color="#000000"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            icon={<SignalCellularAltIcon fontSize="large" />}
            value={stats.online}
            label="Online"
            color="#34c759"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            icon={<LocationOnIcon fontSize="large" />}
            value={stats.offline}
            label="Offline"
            color="#8e8e93"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            icon={<SpeedIcon fontSize="large" />}
            value={stats.moving}
            label="Moving"
            color="#007aff"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography className={classes.sectionTitle}>
            Live Map
          </Typography>
          <Paper className={classes.mapContainer} elevation={0}>
            <MainMap
              filteredPositions={filteredPositions}
              selectedPosition={null}
              onEventsClick={() => {}}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography className={classes.sectionTitle}>
            Devices
          </Typography>
          <Paper className={classes.deviceListContainer} elevation={0}>
            <DeviceList devices={filteredDevices} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
