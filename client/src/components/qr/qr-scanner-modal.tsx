import React, { createContext, useContext, useState } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type QRScannerContextType = {
  isOpen: boolean;
  openScanner: (onScan: (result: string | null) => void) => void;
  closeScanner: () => void;
};

const QRScannerContext = createContext<QRScannerContextType>({
  isOpen: false,
  openScanner: () => {},
  closeScanner: () => {},
});

export const useQRScanner = () => useContext(QRScannerContext);

export const QRScannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [onScanCallback, setOnScanCallback] = useState<(result: string | null) => void>(() => () => {});
  const { toast } = useToast();

  const openScanner = (onScan: (result: string | null) => void) => {
    setIsOpen(true);
    setOnScanCallback(() => onScan);
  };

  const closeScanner = () => {
    setIsOpen(false);
  };

  const handleMockScan = () => {
    // In a real app, we would use a QR code scanning library
    // For now, we'll simulate a successful scan with a mock business ID
    const mockBusinessIds = ["coffee", "attire", "restaurant"];
    const randomBusinessId = mockBusinessIds[Math.floor(Math.random() * mockBusinessIds.length)];
    
    toast({
      title: "QR Code Scanned",
      description: `Successfully scanned business QR code.`,
    });
    
    onScanCallback(randomBusinessId);
    closeScanner();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we would process the image to scan for QR codes
      // For now, we'll simulate a successful scan
      toast({
        title: "Processing Image",
        description: "Please wait while we process your image...",
      });
      
      setTimeout(() => {
        const mockBusinessIds = ["coffee", "attire", "restaurant"];
        const randomBusinessId = mockBusinessIds[Math.floor(Math.random() * mockBusinessIds.length)];
        
        toast({
          title: "QR Code Found",
          description: `Successfully scanned business QR code from image.`,
        });
        
        onScanCallback(randomBusinessId);
        closeScanner();
      }, 1500);
    }
  };

  return (
    <QRScannerContext.Provider value={{ isOpen, openScanner, closeScanner }}>
      {children}

      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Scan QR Code</h3>
              <Button variant="ghost" size="icon" onClick={closeScanner}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="p-4">
              <div 
                className="bg-gray-100 dark:bg-gray-900 rounded-lg aspect-square w-full max-w-sm mx-auto flex items-center justify-center"
                onClick={handleMockScan}
              >
                <div className="relative w-4/5 h-4/5 border-2 border-primary-500">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary-500 -mt-2 -ml-2"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary-500 -mt-2 -mr-2"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary-500 -mb-2 -ml-2"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary-500 -mb-2 -mr-2"></div>
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center">Position the QR code within this frame</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                Scan the QR code at a business to start your recommendation
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 flex justify-end">
              <Button 
                variant="outline" 
                className="mr-2"
                onClick={closeScanner}
              >
                Cancel
              </Button>
              <Button
                className="flex items-center"
                onClick={() => document.getElementById('qr-file-input')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Use Photo
                <input 
                  type="file" 
                  id="qr-file-input" 
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </Button>
            </div>
          </div>
        </div>
      )}
    </QRScannerContext.Provider>
  );
};
