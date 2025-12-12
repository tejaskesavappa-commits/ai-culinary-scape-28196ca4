import React, { useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Loader2, RefreshCw, Utensils, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface MoodResult {
  mood: string;
  confidence: string;
  emoji: string;
  message: string;
  suggestions: {
    name: string;
    description: string;
    type: string;
  }[];
}

const MoodFoodScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [moodResult, setMoodResult] = useState<MoodResult | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setCapturedImage(null);
        setMoodResult(null);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to use the mood scanner.",
        variant: "destructive"
      });
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  }, []);

  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0);
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    
    setCapturedImage(imageDataUrl);
    stopCamera();
    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('mood-food-analyzer', {
        body: { image: imageDataUrl }
      });

      if (error) throw error;

      if (data?.success) {
        setMoodResult(data.result);
      } else {
        throw new Error(data?.error || 'Failed to analyze mood');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze your mood. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [stopCamera]);

  const reset = useCallback(() => {
    setCapturedImage(null);
    setMoodResult(null);
    startCamera();
  }, [startCamera]);

  const getMoodGradient = (mood: string) => {
    const gradients: Record<string, string> = {
      happy: 'from-yellow-400 to-orange-500',
      tired: 'from-indigo-400 to-purple-500',
      stressed: 'from-red-400 to-pink-500',
      hungry: 'from-green-400 to-emerald-500',
      relaxed: 'from-blue-400 to-cyan-500',
      excited: 'from-pink-400 to-rose-500'
    };
    return gradients[mood.toLowerCase()] || 'from-gray-400 to-slate-500';
  };

  return (
    <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background to-muted/30">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/60">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          Mood Food Scanner
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Let AI scan your mood and suggest the perfect dishes for you!
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Camera View */}
        <div className="relative aspect-video bg-muted rounded-xl overflow-hidden border border-border">
          {!isStreaming && !capturedImage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <Camera className="h-16 w-16 text-muted-foreground/50" />
              <p className="text-muted-foreground">Click below to start camera</p>
            </div>
          )}
          
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${isStreaming ? 'block' : 'hidden'}`}
          />
          
          {capturedImage && (
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          )}
          
          {isAnalyzing && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg font-medium">Analyzing your mood...</p>
            </div>
          )}
          
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          {!isStreaming && !capturedImage && (
            <Button onClick={startCamera} size="lg" className="gap-2">
              <Camera className="h-5 w-5" />
              Start Camera
            </Button>
          )}
          
          {isStreaming && (
            <Button onClick={captureAndAnalyze} size="lg" className="gap-2 bg-gradient-to-r from-primary to-primary/80">
              <Sparkles className="h-5 w-5" />
              Scan My Mood
            </Button>
          )}
          
          {capturedImage && !isAnalyzing && (
            <Button onClick={reset} size="lg" variant="outline" className="gap-2">
              <RefreshCw className="h-5 w-5" />
              Try Again
            </Button>
          )}
        </div>

        {/* Mood Result */}
        {moodResult && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Mood Display */}
            <div className={`p-6 rounded-2xl bg-gradient-to-r ${getMoodGradient(moodResult.mood)} text-white`}>
              <div className="flex items-center gap-4">
                <span className="text-5xl">{moodResult.emoji}</span>
                <div>
                  <h3 className="text-2xl font-bold capitalize">{moodResult.mood}</h3>
                  <p className="text-white/90">{moodResult.message}</p>
                </div>
              </div>
            </div>

            {/* Food Suggestions */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <Utensils className="h-5 w-5 text-primary" />
                Perfect dishes for your mood
              </h4>
              
              <div className="grid gap-3">
                {moodResult.suggestions.map((dish, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-muted/50 border border-border hover:bg-muted transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-semibold text-foreground">{dish.name}</h5>
                        <p className="text-sm text-muted-foreground mt-1">{dish.description}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        {dish.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodFoodScanner;
