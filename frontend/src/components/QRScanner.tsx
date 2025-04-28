import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
}

interface ScannerConfig {
  fps: number;
  qrbox: {
    width: number;
    height: number;
  };
  aspectRatio: number;
  disableFlip: boolean;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onScanError }) => {
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const config: ScannerConfig = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      disableFlip: false,
    };

    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      config,
      false
    );

    setScanner(html5QrcodeScanner);

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, []);

  const startScanning = () => {
    if (scanner) {
      setIsScanning(true);
      setError(null);
      
      scanner.render(
        (decodedText: string) => {
          onScanSuccess(decodedText);
          setIsScanning(false);
        },
        (errorMessage: string) => {
          if (onScanError) {
            onScanError(errorMessage);
          }
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

  return (
    <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Scan Customer QR Code
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
    </Box>
  );
};

export default QRScanner; 