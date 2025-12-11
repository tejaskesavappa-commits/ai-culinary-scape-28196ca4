import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Leaf, Flame, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Recommendation {
  name: string;
  description: string;
  cuisineType: string;
  spiceLevel: 'mild' | 'medium' | 'hot';
  isVegetarian: boolean;
}

interface RecommendationResponse {
  recommendations: Recommendation[];
  message: string;
}

const FoodRecommendations = () => {
  const [preferences, setPreferences] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('food-recommendations', {
        body: { preferences, cuisineType, dietaryRestrictions, mood }
      });

      if (error) throw error;
      
      if (data.error) {
        toast.error(data.error);
        return;
      }

      setRecommendations(data);
      toast.success('Here are your personalized recommendations!');
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast.error('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSpiceIcon = (level: string) => {
    switch (level) {
      case 'hot': return <Flame className="h-4 w-4 text-red-500" />;
      case 'medium': return <Flame className="h-4 w-4 text-orange-400" />;
      default: return <Flame className="h-4 w-4 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Food Recommendations
          </CardTitle>
          <CardDescription>
            Tell us your preferences and let AI suggest perfect dishes for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="preferences">What are you craving?</Label>
              <Input
                id="preferences"
                placeholder="e.g., something cheesy, spicy noodles..."
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cuisine">Preferred Cuisine</Label>
              <Select value={cuisineType} onValueChange={setCuisineType}>
                <SelectTrigger>
                  <SelectValue placeholder="Any cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any cuisine</SelectItem>
                  <SelectItem value="indian">Indian</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="mexican">Mexican</SelectItem>
                  <SelectItem value="japanese">Japanese</SelectItem>
                  <SelectItem value="thai">Thai</SelectItem>
                  <SelectItem value="american">American</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietary">Dietary Restrictions</Label>
              <Select value={dietaryRestrictions} onValueChange={setDietaryRestrictions}>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="gluten-free">Gluten-free</SelectItem>
                  <SelectItem value="dairy-free">Dairy-free</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood">Current Mood</Label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comfort">Need comfort food</SelectItem>
                  <SelectItem value="adventurous">Feeling adventurous</SelectItem>
                  <SelectItem value="healthy">Want something healthy</SelectItem>
                  <SelectItem value="indulgent">Ready to indulge</SelectItem>
                  <SelectItem value="quick">Need something quick</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={getRecommendations} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finding perfect dishes...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Get AI Recommendations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {recommendations && (
        <div className="space-y-4">
          {recommendations.message && (
            <p className="text-muted-foreground text-center italic">
              "{recommendations.message}"
            </p>
          )}
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.recommendations.map((dish, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{dish.name}</CardTitle>
                    {dish.isVegetarian && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <Leaf className="h-3 w-3 mr-1" />
                        Veg
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="w-fit">
                    {dish.cuisineType}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {dish.description}
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    {getSpiceIcon(dish.spiceLevel)}
                    <span className="capitalize">{dish.spiceLevel}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodRecommendations;
