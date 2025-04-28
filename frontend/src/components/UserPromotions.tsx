import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  LocalOffer as LocalOfferIcon,
  AccountBalance as AccountBalanceIcon,
  Share as ShareIcon,
} from '@mui/icons-material';

interface Promotion {
  id: string;
  businessName: string;
  businessLogo: string;
  discount: string;
  status: 'active' | 'redeemed';
  shares: number;
  clicks: number;
  coins: number;
}

const mockPromotions: Promotion[] = [
  {
    id: '1',
    businessName: 'Coffee Corner',
    businessLogo: '☕',
    discount: '10% off',
    status: 'active',
    shares: 5,
    clicks: 12,
    coins: 50,
  },
  {
    id: '2',
    businessName: 'Pizza Place',
    businessLogo: '🍕',
    discount: '10% off',
    status: 'redeemed',
    shares: 3,
    clicks: 8,
    coins: 30,
  },
];

const UserPromotions: React.FC = () => {
  const totalCoins = mockPromotions.reduce((sum, promo) => sum + promo.coins, 0);

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Your Coins</Typography>
              </Box>
              <Typography variant="h3" gutterBottom>
                {totalCoins}
              </Typography>
              <Chip
                label="Earn more by sharing"
                color="primary"
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalOfferIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Your Promotions</Typography>
              </Box>
              
              <List>
                {mockPromotions.map((promo, index) => (
                  <React.Fragment key={promo.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>{promo.businessLogo}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={promo.businessName}
                        secondary={
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Chip
                              size="small"
                              label={promo.discount}
                              color="primary"
                            />
                            <Chip
                              size="small"
                              label={`${promo.shares} shares`}
                              icon={<ShareIcon />}
                            />
                            <Chip
                              size="small"
                              label={`${promo.coins} coins`}
                              color="secondary"
                            />
                          </Box>
                        }
                      />
                      <Chip
                        label={promo.status}
                        color={promo.status === 'active' ? 'success' : 'default'}
                      />
                    </ListItem>
                    {index < mockPromotions.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserPromotions; 