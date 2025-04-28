import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

interface ScannerConfig {
  fps: number;
  qrbox: {
    width: number;
    height: number;
  };
  aspectRatio: number;
  disableFlip: boolean;
}

const QRCodeScanner: React.FC = () => {
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const navigate = useNavigate();

  const startScanning = () => {
    if (scanner) {
      setIsScanning(true);
      setError(null);
      
      scanner.render(
        (decodedText: string) => {
          setScannedData(decodedText);
          setShowDialog(true);
          setIsScanning(false);
        },
        (errorMessage: string) => {
          setError(errorMessage);
          setIsScanning(false);
        }
      );
    }
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.clear();
      setIsScanning(false);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setScannedData(null);
  };

  const handleProceed = () => {
    if (scannedData) {
      // Navigate to the referral page with the business ID
      navigate(`/referral/${scannedData}`);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Scan Business QR Code
        </Typography>
        
        <Box
          id="qr-reader"
          sx={{
            width: '100%',
            minHeight: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: 1,
            mb: 2,
          }}
        >
          {!isScanning && (
            <Typography variant="body1" color="text.secondary">
              Click "Start Scanning" to begin
            </Typography>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={startScanning}
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Scanning...
              </>
            ) : (
              'Start Scanning'
            )}
          </Button>
          
          {isScanning && (
            <Button
              variant="outlined"
              onClick={stopScanning}
            >
              Stop Scanning
            </Button>
          )}
        </Box>
      </Paper>

      <Dialog open={showDialog} onClose={handleDialogClose}>
        <DialogTitle>QR Code Scanned</DialogTitle>
        <DialogContent>
          <Typography>
            Would you like to proceed to create a recommendation for this business?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleProceed} variant="contained">
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QRCodeScanner; 