import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  alpha,
  Chip,
  LinearProgress,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpeedIcon from '@mui/icons-material/Speed';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import MainMap from '../main/MainMap';
import DeviceList from '../main/DeviceList';
import useFilter from '../main/useFilter';

const useStyles = makeStyles()((theme) => ({
  root: {
    padding: theme.spacing(3),
    height: '100%',
    overflow: 'auto',
  },
  header: {
    marginBottom: theme.spacing(3),
  },
  statCard: {
    height: '100%',
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px solid ${theme.palette.divider}`,
    transition: 'all 0.3s ease-in-out',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[6],
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
    },
  },
  statContent: {
    padding: theme.spacing(3),
  },
  statIcon: {
    width: 64,
    height: 64,
    borderRadius: theme.shape.borderRadius * 1.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: theme.spacing(0.5),
  },
  statLabel: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
  },
  trend: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    fontSize: '0.875rem',
  },
  mapContainer: {
    height: 500,
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,
  },
  deviceListContainer: {
    height: 500,
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.paper,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  activityCard: {
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 1.5,
    border: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(1.5),
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      background: alpha(theme.palette.primary.main, 0.02),
      borderColor: theme.palette.primary.light,
    },
  },
}));

const StatCard = ({ icon, value, label, color, trend, trendValue }) => {
  const { classes } = useStyles();

  return (
    <Card
      className={classes.statCard}
      elevation={0}
      sx={{
        '&::before': {
          background: color,
        },
      }}
    >
      <CardContent className={classes.statContent}>
        <Box
          className={classes.statIcon}
          sx={{
            background: alpha(color, 0.1),
            color: color,
          }}
        >
          {icon}
        </Box>
        <Typography className={classes.statValue}>{value}</Typography>
        <Typography className={classes.statLabel}>{label}</Typography>
        {trend && (
          <Box className={classes.trend}>
            {trend === 'up' ? (
              <TrendingUpIcon fontSize="small" sx={{ color: 'success.main' }} />
            ) : (
              <TrendingDownIcon fontSize="small" sx={{ color: 'error.main' }} />
            )}
            <Typography
              variant="body2"
              sx={{
                color: trend === 'up' ? 'success.main' : 'error.main',
                fontWeight: 600,
              }}
            >
              {trendValue}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              vs last week
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { classes } = useStyles();
  const devices = useSelector((state) => state.devices.items);
  const positions = useSelector((state) => state.session.positions);

  const [filteredDevices, setFilteredDevices] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);

  useFilter('', { statuses: [], groups: [] }, '', false, positions, setFilteredDevices, setFilteredPositions);

  const stats = useMemo(() => {
    const deviceArray = Object.values(devices);
    const total = deviceArray.length;
    const online = deviceArray.filter((d) => d.status === 'online').length;
    const offline = deviceArray.filter((d) => d.status === 'offline').length;
    const moving = Object.values(positions).filter((p) => p.speed > 0).length;

    return {
      total,
      online,
      offline,
      moving,
      onlinePercentage: total > 0 ? Math.round((online / total) * 100) : 0,
    };
  }, [devices, positions]);

  const recentActivity = useMemo(() => {
    const positionsArray = Object.values(positions);
    return positionsArray
      .sort((a, b) => new Date(b.deviceTime) - new Date(a.deviceTime))
      .slice(0, 5)
      .map((pos) => {
        const device = devices[pos.deviceId];
        return {
          id: pos.id,
          deviceName: device?.name || 'Unknown',
          time: new Date(pos.deviceTime).toLocaleTimeString(),
          speed: Math.round(pos.speed * 1.852),
          status: device?.status || 'unknown',
        };
      });
  }, [positions, devices]);

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Real-time GPS tracking and fleet management
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<DirectionsCarIcon fontSize="large" />}
            value={stats.total}
            label="Total Devices"
            color="#2563eb"
            trend="up"
            trendValue="+5%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<SignalCellularAltIcon fontSize="large" />}
            value={stats.online}
            label="Online Now"
            color="#059669"
            trend="up"
            trendValue="+12%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<LocationOnIcon fontSize="large" />}
            value={stats.offline}
            label="Offline"
            color="#dc2626"
            trend="down"
            trendValue="-3%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<SpeedIcon fontSize="large" />}
            value={stats.moving}
            label="Moving"
            color="#d97706"
            trend="up"
            trendValue="+8%"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Box>
            <Box className={classes.sectionHeader}>
              <Typography variant="h6" fontWeight={600}>
                Live Map Tracking
              </Typography>
              <Chip
                label={`${stats.online} Active`}
                color="success"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>
            <Paper className={classes.mapContainer} elevation={0}>
              <MainMap
                filteredPositions={filteredPositions}
                selectedPosition={null}
                onEventsClick={() => {}}
              />
            </Paper>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box>
            <Box className={classes.sectionHeader}>
              <Typography variant="h6" fontWeight={600}>
                Recent Activity
              </Typography>
            </Box>
            <Box>
              {recentActivity.map((activity) => (
                <Paper key={activity.id} className={classes.activityCard} elevation={0}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {activity.deviceName}
                    </Typography>
                    <Chip
                      label={activity.status}
                      size="small"
                      color={activity.status === 'online' ? 'success' : 'default'}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      •
                    </Typography>
                    <Typography variant="caption" fontWeight={600}>
                      {activity.speed} km/h
                    </Typography>
                  </Box>
                </Paper>
              ))}
              {recentActivity.length === 0 && (
                <Paper className={classes.activityCard} elevation={0}>
                  <Typography variant="body2" color="text.secondary" align="center">
                    No recent activity
                  </Typography>
                </Paper>
              )}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box>
            <Box className={classes.sectionHeader}>
              <Typography variant="h6" fontWeight={600}>
                Device List
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Fleet Status:
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={stats.onlinePercentage}
                  sx={{ width: 100, mt: 1 }}
                  color="success"
                />
                <Typography variant="body2" fontWeight={600}>
                  {stats.onlinePercentage}%
                </Typography>
              </Box>
            </Box>
            <Paper className={classes.deviceListContainer} elevation={0}>
              <DeviceList devices={filteredDevices} />
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
