import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Share as ShareIcon,
  LocalOffer as LocalOfferIcon,
} from '@mui/icons-material';

interface AnalyticsData {
  totalScans: number;
  uniqueUsers: number;
  shares: number;
  activePromotions: number;
  scanTrend: number[];
  userGrowth: number[];
}

const mockAnalytics: AnalyticsData = {
  totalScans: 150,
  uniqueUsers: 45,
  shares: 78,
  activePromotions: 3,
  scanTrend: [10, 15, 20, 25, 30, 25, 25],
  userGrowth: [5, 10, 15, 20, 25, 30, 35],
};

const BusinessAnalytics: React.FC = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Total Scans</Typography>
              </Box>
              <Typography variant="h3" gutterBottom>
                {mockAnalytics.totalScans}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={70}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Unique Users</Typography>
              </Box>
              <Typography variant="h3" gutterBottom>
                {mockAnalytics.uniqueUsers}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={60}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShareIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Shares</Typography>
              </Box>
              <Typography variant="h3" gutterBottom>
                {mockAnalytics.shares}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={80}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalOfferIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Active Promotions</Typography>
              </Box>
              <Typography variant="h3" gutterBottom>
                {mockAnalytics.activePromotions}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={50}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="New user scan"
                    secondary="2 minutes ago"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Promotion shared"
                    secondary="15 minutes ago"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="New promotion created"
                    secondary="1 hour ago"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BusinessAnalytics; 