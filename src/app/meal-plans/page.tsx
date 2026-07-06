'use client';

import { authClient } from '@/lib/auth-client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Apple, LayoutDashboard, UtensilsCrossed, Plus, LogOut, Info } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function MealPlansPage() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  useEffect(() => {
    if (!isSessionPending && !session) {
      redirect('/account/signin');
    }
  }, [session, isSessionPending]);

  if (isSessionPending) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
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
            />
            <NavItem
              href="/meal-plans"
              icon={<UtensilsCrossed className="h-4 w-4" />}
              label="Meal Plans"
              active
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
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <header>
            <h1 className="text-2xl font-bold text-slate-900">Your Meal Plans</h1>
            <p className="text-slate-500">Customized nutritional guidance from your dietitian.</p>
          </header>

          <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
            <CardHeader>
              <CardTitle className="text-green-800">Current Plan: Weight Management 2026</CardTitle>
              <CardDescription>Created by Dr. Smith, Registered Dietitian</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="bg-white p-3 rounded-lg border border-green-100 shadow-sm"
                  >
                    <div className="text-xs font-bold text-green-600 mb-2">{day}</div>
                    <div className="space-y-2">
                      <MealItem label="B" name="Oatmeal & Fruit" />
                      <MealItem label="L" name="Chicken Salad" />
                      <MealItem label="D" name="Grilled Salmon" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nutritional Focus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Info className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-sm text-slate-600">
                    This plan focuses on high-protein, moderate-carb intake to support your fat loss
                    goal while maintaining muscle mass.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <Info className="h-4 w-4 text-orange-600" />
                  </div>
                  <p className="text-sm text-slate-600">
                    Remember to stay hydrated! Aim for at least 2.5L of water daily.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dietitian's Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 italic">
                  "You're doing great! For this week, try to swap your afternoon snack for a handful
                  of almonds if you're feeling extra hungry between lunch and dinner. Keep tracking
                  consistently!"
                </p>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm">
                    Message Dr. Smith
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
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

function MealItem({ label, name }: { label: string; name: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] font-bold text-slate-400 w-3">{label}</span>
      <span className="text-[11px] text-slate-700 truncate">{name}</span>
    </div>
  );
}
