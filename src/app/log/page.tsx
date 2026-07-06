'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Apple, ChevronLeft, Plus, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LogFoodPage() {
  const [search, setSearch] = useState('');
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [quantity, setQuantity] = useState('100');
  const [mealType, setMealType] = useState('Breakfast');
  const [currentDate, setCurrentDate] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    setCurrentDate(new Date().toISOString().split('T')[0]);
  }, []);

  const { data: foods, isLoading: isSearching } = useQuery({
    queryKey: ['foods', search],
    queryFn: async () => {
      const res = await fetch(`/api/foods?q=${search}`);
      if (!res.ok) throw new Error('Search failed');
      return res.json();
    },
    enabled: search.length > 1,
  });

  const mutation = useMutation({
    mutationFn: async (newLog: any) => {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog),
      });
      if (!res.ok) throw new Error('Failed to log food');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Food logged successfully!');
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      router.push('/dashboard');
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  const handleLog = () => {
    if (!selectedFood) return;
    const dateToUse = currentDate || '2026-06-27'; // Use a stable fallback
    mutation.mutate({
      food_id: selectedFood.id,
      quantity_g: Number(quantity),
      meal_type: mealType,
      log_date: dateToUse,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Log Your Food</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Food Database</CardTitle>
            <CardDescription>Search for ingredients or branded items</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search foods (e.g. Chicken, Broccoli...)"
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {isSearching && (
              <div className="text-center py-4 text-sm text-slate-500">Searching...</div>
            )}

            {foods && foods.length > 0 && (
              <div className="border rounded-md divide-y overflow-hidden max-h-60 overflow-y-auto bg-white">
                {foods.map((food: any) => (
                  <button
                    key={food.id}
                    className={`w-full text-left p-3 text-sm hover:bg-slate-50 transition-colors flex items-center justify-between ${selectedFood?.id === food.id ? 'bg-green-50' : ''}`}
                    onClick={() => setSelectedFood(food)}
                  >
                    <div>
                      <div className="font-medium text-slate-900">{food.name}</div>
                      <div className="text-xs text-slate-500">
                        {food.calories_per_100g} kcal per 100g
                      </div>
                    </div>
                    {selectedFood?.id === food.id && <Apple className="h-4 w-4 text-green-600" />}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {selectedFood && (
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <CardHeader>
              <CardTitle>Log {selectedFood.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Meal Type</Label>
                  <Select value={mealType} onValueChange={setMealType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Breakfast">Breakfast</SelectItem>
                      <SelectItem value="Lunch">Lunch</SelectItem>
                      <SelectItem value="Dinner">Dinner</SelectItem>
                      <SelectItem value="Snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantity (grams)</Label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Calories:</span>
                  <span className="font-bold text-slate-900">
                    {Math.round(selectedFood.calories_per_100g * (Number(quantity) / 100))} kcal
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="text-xs">
                    <div className="text-slate-500 mb-1">Protein</div>
                    <div className="font-bold">
                      {Math.round(selectedFood.protein_per_100g * (Number(quantity) / 100))}g
                    </div>
                  </div>
                  <div className="text-xs">
                    <div className="text-slate-500 mb-1">Carbs</div>
                    <div className="font-bold">
                      {Math.round(selectedFood.carbs_per_100g * (Number(quantity) / 100))}g
                    </div>
                  </div>
                  <div className="text-xs">
                    <div className="text-slate-500 mb-1">Fat</div>
                    <div className="font-bold">
                      {Math.round(selectedFood.fat_per_100g * (Number(quantity) / 100))}g
                    </div>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
                onClick={handleLog}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  'Logging...'
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" /> Confirm Log
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
