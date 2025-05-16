import { useState } from "react";
import { Link } from "wouter";
import { 
  Share2, 
  Star,
  Clock, 
  Users,
  CheckCircle2
} from "lucide-react";
import { saveOffer } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RecommendationCardProps {
  id: string;
  businessName: string;
  businessImage: string;
  description: string;
  discount: string;
  rating: number;
  recommenderName: string;
  recommenderPhoto: string;
  recommenderId: string;
  validUntil: string;
  savedCount: number;
  saved?: boolean;
}

export default function RecommendationCard({
  id,
  businessName,
  businessImage,
  description,
  discount,
  rating,
  recommenderName,
  recommenderPhoto,
  recommenderId,
  validUntil,
  savedCount,
  saved = false,
}: RecommendationCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(saved);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [localSavedCount, setLocalSavedCount] = useState(savedCount);

  const handleSaveOffer = async () => {
    if (!user) {
      setIsDialogOpen(true);
      return;
    }

    try {
      await saveOffer(user.uid, id);
      setIsSaved(true);
      setLocalSavedCount(prev => prev + 1);
      toast({
        title: "Offer saved",
        description: `You've saved the offer from ${businessName}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save offer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareSocial = () => {
    if (navigator.share) {
      navigator.share({
        title: `${discount} off at ${businessName}`,
        text: description,
        url: window.location.href,
      }).catch(error => {
        toast({
          title: "Error",
          description: "Failed to share. Please try again.",
          variant: "destructive",
        });
      });
    } else {
      // Fallback
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`${discount} off at ${businessName}: ${description}`);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition duration-300">
        <div className="relative">
          <img 
            src={businessImage} 
            alt={businessName} 
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            {discount}
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{businessName}</h3>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300 dark:text-gray-600'}`} 
                />
              ))}
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{description}</p>
          
          <div className="flex items-center mt-4">
            <Avatar className="h-6 w-6">
              <AvatarImage src={recommenderPhoto} alt={recommenderName} />
              <AvatarFallback>{recommenderName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              Recommended by <span className="font-medium text-gray-700 dark:text-gray-300">{recommenderName}</span>
            </span>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              <span>Valid until {validUntil}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Users className="h-4 w-4 mr-1" />
              <span>{localSavedCount} people saved</span>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between">
            <Button 
              className={`flex-1 mr-2 ${isSaved ? 'bg-green-500 hover:bg-green-600' : 'bg-primary-500 hover:bg-primary-600'}`}
              onClick={handleSaveOffer}
              disabled={isSaved}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Saved
                </>
              ) : (
                'Save Offer'
              )}
            </Button>
            <Button 
              variant="outline" 
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
              onClick={shareSocial}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Login Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be logged in to save offers. Would you like to log in now?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Link href="/login">
              <AlertDialogAction>Log In</AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
