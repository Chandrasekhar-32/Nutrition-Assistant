'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { Apple, Activity, Calculator, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const { data: session } = authClient.useSession();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center bg-white border-b border-slate-200 sticky top-0 z-50">
        <Link className="flex items-center justify-center" href="/">
          <Apple className="h-6 w-6 text-green-600" />
          <span className="ml-2 text-xl font-bold text-slate-900 tracking-tight">NutriAssist</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:text-green-600 transition-colors py-2"
            href="#features"
          >
            Features
          </Link>
          {session ? (
            <Link href="/dashboard">
              <Button variant="default" className="bg-green-600 hover:bg-green-700">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/account/signin">
                <Button variant="ghost" className="text-sm font-medium">
                  Sign In
                </Button>
              </Link>
              <Link href="/account/signup">
                <Button className="bg-green-600 hover:bg-green-700">Get Started</Button>
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-white overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-slate-900">
                  Your Personalized Journey to <span className="text-green-600">Better Health</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-500 md:text-xl dark:text-slate-400">
                  Simplify your nutrition with personalized meal plans, interactive tracking, and
                  data-driven insights. Built for health goals, managed by experts.
                </p>
              </div>
              <div className="space-x-4">
                {session ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8">
                      Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/account/signup">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8">
                      Start Your Plan <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="lg" className="px-8">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-slate-900 underline decoration-green-500 decoration-4 underline-offset-8">
                Features designed for your success
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Calculator className="h-10 w-10 text-green-600" />}
                title="Smart Calorie Tracking"
                description="Easily log your meals and track calories, proteins, carbs, and fats in real-time."
              />
              <FeatureCard
                icon={<Activity className="h-10 w-10 text-blue-600" />}
                title="Progress Monitoring"
                description="Visualize your journey with detailed charts and health insights that keep you motivated."
              />
              <FeatureCard
                icon={<Users className="h-10 w-10 text-purple-600" />}
                title="Dietitian Support"
                description="Connect with nutrition professionals who can create and manage your custom meal plans."
              />
              <FeatureCard
                icon={<CheckCircle2 className="h-10 w-10 text-orange-600" />}
                title="Goal Management"
                description="Set and track weight, muscle gain, or performance goals with precision."
              />
              <FeatureCard
                icon={<Apple className="h-10 w-10 text-red-600" />}
                title="Nutrient Analysis"
                description="Deep dive into the nutritional value of everything you eat."
              />
              <FeatureCard
                icon={<ArrowRight className="h-10 w-10 text-teal-600" />}
                title="Interactive Dashboard"
                description="A central hub for all your nutrition and wellness data."
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white">
        <p className="text-xs text-slate-500">© 2026 NutriAssist Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-slate-900">{title}</h3>
      <p className="text-slate-500 text-center">{description}</p>
    </div>
  );
}
