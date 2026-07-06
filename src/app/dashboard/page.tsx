'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Apple,
  Activity,
  Utensils,
  Info,
  LogOut,
  LayoutDashboard,
  UtensilsCrossed,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(''); // Init with empty string
  const [todayDate, setTodayDate] = useState(''); // Store today's date separately
  const queryClient = useQueryClient();

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    setTodayDate(today);
  }, []);

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!isSessionPending && !session) {
      router.push('/account/signin?callbackUrl=/dashboard');
    }
  }, [session, isSessionPending, router]);

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await fetch('/api/profile');
      if (!res.ok) throw new Error('Failed to fetch profile');
      return res.json();
    },
    enabled: !!session,
  });

  const { data: logs, isLoading: isLogsLoading } = useQuery({
    queryKey: ['logs', selectedDate],
    queryFn: async () => {
      const res = await fetch(`/api/logs?date=${selectedDate}`);
      if (!res.ok) throw new Error('Failed to fetch logs');
      return res.json();
    },
    enabled: !!session,
  });

  if (isSessionPending || isProfileLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading your health dashboard...
      </div>
    );
  }
 const safeLogs = logs ?? [];
  const totals = safeLogs.reduce(
    (acc: any, log: any) => {
      acc.calories += Number(log.calories || 0);
      acc.protein += Number(log.protein || 0);
      acc.carbs += Number(log.carbs || 0);
      acc.fat += Number(log.fat || 0);
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  ) || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const calorieGoal = profile?.daily_calorie_goal || 2000;
  const calorieProgress = Math.min((totals.calories / calorieGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <Apple className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold text-slate-900">NutriAssist</span>
          </Link>
          <nav className="space-y-1">
            <NavItem
              href="/dashboard"
              icon={<LayoutDashboard className="h-4 w-4" />}
              label="Dashboard"
              active
            />
            <NavItem
              href="/meal-plans"
              icon={<UtensilsCrossed className="h-4 w-4" />}
              label="Meal Plans"
            />
            <NavItem href="/log" icon={<Plus className="h-4 w-4" />} label="Log Food" />
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-slate-100">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-500"
            onClick={() => authClient.signOut()}
          >
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Welcome back, {session?.user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-slate-500">Track your nutrition and stay on top of your goals.</p>
            </div>
            <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const baseDate = selectedDate || '2026-06-27';
                  const d = new Date(baseDate);
                  d.setDate(d.getDate() - 1);
                  setSelectedDate(d.toISOString().split('T')[0]);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-2">
                {selectedDate && selectedDate === todayDate ? 'Today' : selectedDate}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const baseDate = selectedDate || '2026-06-27';
                  const d = new Date(baseDate);
                  d.setDate(d.getDate() + 1);
                  setSelectedDate(d.toISOString().split('T')[0]);
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-600" /> Daily Calories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-4xl font-bold text-slate-900">{totals.calories}</span>
                  <span className="text-slate-400 mb-1">/ {calorieGoal} kcal</span>
                </div>
                <Progress value={calorieProgress} className="h-3 bg-slate-100" />
                <p className="mt-2 text-xs text-slate-500">
                  {totals.calories >= calorieGoal
                    ? "You've reached your daily goal!"
                    : `${calorieGoal - totals.calories} calories remaining for today.`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                  Weight Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-4">
                <div className="text-3xl font-bold text-slate-900">
                  {profile?.current_weight || '--'} kg
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Goal: {profile?.goal_weight || '--'} kg
                </div>
                <Link href="/profile/edit" className="mt-4">
                  <Button variant="outline" size="sm" className="text-xs">
                    Update Weight
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MacroCard
              label="Protein"
              value={Math.round(totals.protein)}
              unit="g"
              color="bg-red-500"
            />
            <MacroCard
              label="Carbs"
              value={Math.round(totals.carbs)}
              unit="g"
              color="bg-blue-500"
            />
            <MacroCard label="Fats" value={Math.round(totals.fat)} unit="g" color="bg-yellow-500" />
            <MacroCard label="Water" value={2.4} unit="L" color="bg-cyan-500" />
          </div>

          {/* Daily Logs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Daily Food Log</CardTitle>
                <CardDescription>Everything you've eaten today</CardDescription>
              </div>
              <Link href="/log">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" /> Log Food
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLogsLoading ? (
                <div className="py-8 text-center text-slate-500">Loading logs...</div>
              ) : logs?.length === 0 ? (
                <div className="py-12 text-center">

                  <Utensils className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500">No logs for this day. Start by adding a meal!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((mealType) => {
                    const mealLogs = (logs ?? []).filter((l: any) => l.meal_type === mealType);
                    if (mealLogs.length === 0) return null;
                    return (
                      <div key={mealType} className="space-y-2">
                        <h4 className="text-sm font-semibold text-slate-900 border-b pb-1">
                          {mealType}
                        </h4>
                        {mealLogs.map((log: any) => (
                          <div
                            key={log.id}
                            className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <div>
                              <div className="font-medium text-slate-900">{log.food_name}</div>
                              <div className="text-xs text-slate-500">{log.quantity_g}g</div>
                            </div>
                            <div className="text-sm font-bold text-slate-700">
                              {log.calories} kcal
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function NavItem({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-green-50 text-green-700'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function MacroCard({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
}) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="text-xs font-medium text-slate-500 uppercase mb-2">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        <span className="text-xs text-slate-400">{unit}</span>
      </div>
      <div className={`h-1 w-full mt-3 rounded-full ${color} opacity-20`} />
    </div>
  );
}
