import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const EnvTest: React.FC = () => {
  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Environment Variables Test
      </Typography>
      <Box sx={{ fontFamily: 'monospace' }}>
        <pre>
          {JSON.stringify(
            {
              VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
              VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
              VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
              VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
              VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
              VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
            },
            null,
            2
          )}
        </pre>
      </Box>
    </Paper>
  );
};

export default EnvTest; 