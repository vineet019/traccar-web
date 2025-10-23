import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography, Box, alpha } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpeedIcon from '@mui/icons-material/Speed';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

const useStyles = makeStyles()((theme) => ({
  card: {
    height: '100%',
    borderRadius: theme.shape.borderRadius * 1.5,
    transition: 'all 0.3s ease-in-out',
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[4],
    },
  },
  cardContent: {
    padding: theme.spacing(2.5),
    '&:last-child': {
      paddingBottom: theme.spacing(2.5),
    },
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
  },
  value: {
    fontWeight: 700,
    fontSize: '2rem',
    lineHeight: 1.2,
    marginBottom: theme.spacing(0.5),
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.palette.text.secondary,
  },
  trend: {
    fontSize: '0.75rem',
    fontWeight: 500,
    marginTop: theme.spacing(1),
  },
  online: {
    background: alpha(theme.palette.success.main, 0.1),
    color: theme.palette.success.main,
  },
  offline: {
    background: alpha(theme.palette.error.main, 0.1),
    color: theme.palette.error.main,
  },
  total: {
    background: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
  },
  moving: {
    background: alpha(theme.palette.secondary.main, 0.1),
    color: theme.palette.secondary.main,
  },
}));

const StatCard = ({ icon, value, label, colorClass }) => {
  const { classes } = useStyles();

  return (
    <Card className={classes.card} elevation={0}>
      <CardContent className={classes.cardContent}>
        <Box className={`${classes.iconWrapper} ${classes[colorClass]}`}>
          {icon}
        </Box>
        <Typography className={classes.value}>
          {value}
        </Typography>
        <Typography className={classes.label}>
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
};

const DashboardStats = () => {
  const devices = useSelector((state) => state.devices.items);
  const positions = useSelector((state) => state.session.positions);

  const stats = useMemo(() => {
    const deviceArray = Object.values(devices);
    const total = deviceArray.length;
    const online = deviceArray.filter((d) => d.status === 'online').length;
    const offline = deviceArray.filter((d) => d.status === 'offline').length;

    const moving = Object.values(positions).filter((p) => p.speed > 0).length;

    return { total, online, offline, moving };
  }, [devices, positions]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} sm={3}>
        <StatCard
          icon={<DirectionsCarIcon fontSize="large" />}
          value={stats.total}
          label="Total Devices"
          colorClass="total"
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <StatCard
          icon={<SignalCellularAltIcon fontSize="large" />}
          value={stats.online}
          label="Online"
          colorClass="online"
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <StatCard
          icon={<LocationOnIcon fontSize="large" />}
          value={stats.offline}
          label="Offline"
          colorClass="offline"
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <StatCard
          icon={<SpeedIcon fontSize="large" />}
          value={stats.moving}
          label="Moving"
          colorClass="moving"
        />
      </Grid>
    </Grid>
  );
};

export default DashboardStats;
