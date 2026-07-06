'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await fetch('/api/profile');
      if (!res.ok) throw new Error('Failed to fetch profile');
      return res.json();
    },
  });

  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: '',
    height: '',
    current_weight: '',
    goal_weight: '',
    daily_calorie_goal: '2000',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        age: profile.age?.toString() || '',
        gender: profile.gender || '',
        height: profile.height?.toString() || '',
        current_weight: profile.current_weight?.toString() || '',
        goal_weight: profile.goal_weight?.toString() || '',
        daily_calorie_goal: profile.daily_calorie_goal?.toString() || '2000',
      });
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: async (updatedData: any) => {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Profile updated!');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      router.push('/dashboard');
    },
  });

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Health Profile</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Age</Label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Input
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Height (cm)</Label>
                <Input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Current Weight (kg)</Label>
                <Input
                  type="number"
                  value={formData.current_weight}
                  onChange={(e) => setFormData({ ...formData, current_weight: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Goal Weight (kg)</Label>
                <Input
                  type="number"
                  value={formData.goal_weight}
                  onChange={(e) => setFormData({ ...formData, goal_weight: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Daily Calorie Goal (kcal)</Label>
              <Input
                type="number"
                value={formData.daily_calorie_goal}
                onChange={(e) => setFormData({ ...formData, daily_calorie_goal: e.target.value })}
              />
            </div>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 mt-4"
              onClick={() =>
                mutation.mutate({
                  ...formData,
                  age: formData.age ? Number(formData.age) : null,
                  height: formData.height ? Number(formData.height) : null,
                  current_weight: formData.current_weight ? Number(formData.current_weight) : null,
                  goal_weight: formData.goal_weight ? Number(formData.goal_weight) : null,
                  daily_calorie_goal: formData.daily_calorie_goal
                    ? Number(formData.daily_calorie_goal)
                    : 2000,
                })
              }
              disabled={mutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" /> Save Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
