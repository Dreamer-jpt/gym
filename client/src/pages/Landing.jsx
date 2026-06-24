import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import {
  Dumbbell,
  BarChart3,
  Target,
  TrendingUp,
  Users,
  Shield,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Calendar,
  Activity,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { useState } from "react";

export default function Landing() {
  const { user } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Dumbbell className="w-7 h-7 text-primary-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                FitTrack Pro
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
              <a href="#about" className="text-sm text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white transition-colors">About</a>
              <button onClick={toggleDarkMode} className="text-sm text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                {darkMode ? "Light" : "Dark"} Mode
              </button>
              {user ? (
                <button onClick={() => navigate("/dashboard")} className="btn-primary text-sm">
                  Dashboard
                </button>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                    Log in
                  </Link>
                  <Link to="/register" className="btn-primary text-sm">
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
            <button className="md:hidden btn-ghost p-2" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden border-t border-gray-100 dark:border-dark-800 px-4 py-4 space-y-3">
            <a href="#features" onClick={() => setMobileMenu(false)} className="block text-sm text-gray-600 dark:text-dark-300">Features</a>
            <a href="#about" onClick={() => setMobileMenu(false)} className="block text-sm text-gray-600 dark:text-dark-300">About</a>
            <button onClick={toggleDarkMode} className="block text-sm text-gray-600 dark:text-dark-300">Toggle Theme</button>
            {user ? (
              <button onClick={() => navigate("/dashboard")} className="btn-primary text-sm w-full">Dashboard</button>
            ) : (
              <div className="space-y-2">
                <Link to="/login" className="btn-secondary text-sm w-full block text-center">Log in</Link>
                <Link to="/register" className="btn-primary text-sm w-full block text-center">Get Started Free</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-dark-900 dark:via-dark-900 dark:to-primary-950/30" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300/20 dark:bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-300/20 dark:bg-accent-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Your Ultimate Gym Companion
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
              Track Your Fitness Journey
              <span className="block bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                Achieve Your Goals
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-dark-300 max-w-2xl mx-auto mb-10">
              FitTrack Pro helps you log workouts, track progress, set goals, and crush your personal records - all in one beautiful dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <button onClick={() => navigate("/dashboard")} className="btn-primary text-lg px-8 py-3">
                  Go to Dashboard <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <>
                  <Link to="/register" className="btn-primary text-lg px-8 py-3">
                    Start Free Trial <ChevronRight className="w-5 h-5" />
                  </Link>
                  <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-gray-50 dark:bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-600 dark:text-dark-300 max-w-2xl mx-auto">
              Powerful features designed to help you track, analyze, and improve your fitness journey.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Dumbbell, title: "Workout Tracking", description: "Log every workout with exercises, sets, reps, and weights. Track your volume and calories burned." },
              { icon: BarChart3, title: "Advanced Analytics", description: "Beautiful charts showing your progress, volume trends, muscle group distribution, and consistency." },
              { icon: Target, title: "Goal Setting", description: "Set fitness goals, track progress, and stay motivated with visual progress indicators." },
              { icon: TrendingUp, title: "Progress Tracking", description: "Track body measurements, weight, and body fat over time with interactive charts." },
              { icon: Activity, title: "Personal Records", description: "Automatically track your PRs for every exercise. Know your best lifts at a glance." },
              { icon: Calendar, title: "Workout History", description: "Browse your complete workout history. Filter by date, muscle group, or search keywords." },
            ].map((feature, i) => (
              <div key={i} className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-700 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-dark-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Track Every Rep, Set, and Pound
              </h2>
              <p className="text-gray-600 dark:text-dark-300 mb-6">
                Log your workouts with detailed exercise tracking. Add sets, reps, weights, and notes. 
                Our smart system automatically calculates total volume and estimates calories burned.
              </p>
              <ul className="space-y-3">
                {[
                  "Create custom workout routines",
                  "Track exercises by muscle group",
                  "Auto-calculated total volume",
                  "Exercise library with instructions",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-700 dark:text-dark-200">
                    <div className="w-5 h-5 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center">
                      <ChevronRight className="w-3 h-3 text-accent-600 dark:text-accent-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-100 dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-dark-700">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Upper Body Push</span>
                  <span className="text-xs text-gray-500">Today</span>
                </div>
                {[
                  { name: "Bench Press", sets: "4x10", weight: "135 lbs" },
                  { name: "Shoulder Press", sets: "3x12", weight: "50 lbs" },
                  { name: "Tricep Pushdown", sets: "3x15", weight: "40 lbs" },
                ].map((ex, i) => (
                  <div key={i} className="bg-white dark:bg-dark-700 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{ex.name}</p>
                      <p className="text-xs text-gray-500">{ex.sets}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary-600">{ex.weight}</span>
                  </div>
                ))}
                <div className="pt-2 text-center text-sm text-gray-500">
                  Total Volume: <span className="font-semibold text-primary-600">9,400 lbs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Weight Trend</p>
                    <p className="text-2xl font-bold text-accent-600">174 lbs</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Body Fat</p>
                    <p className="text-2xl font-bold text-primary-600">15.2%</p>
                  </div>
                </div>
                <div className="h-40 bg-gray-50 dark:bg-dark-700 rounded-lg flex items-end justify-around p-4 gap-2">
                  {[60, 45, 70, 55, 80, 65, 75].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-primary-500/20 rounded-t" style={{ height: `${h}%` }} />
                      <span className="text-[10px] text-gray-500">M{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Visualize Your Progress
              </h2>
              <p className="text-gray-600 dark:text-dark-300 mb-6">
                Track your body measurements, weight changes, and workout volume over time with 
                beautiful interactive charts. See how far you've come.
              </p>
              <ul className="space-y-3">
                {[
                  "Weight and body fat tracking",
                  "Chest, waist, arms measurements",
                  "Workout volume over time",
                  "Muscle group distribution",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-700 dark:text-dark-200">
                    <div className="w-5 h-5 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center">
                      <ChevronRight className="w-3 h-3 text-accent-600 dark:text-accent-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Users className="w-12 h-12 text-primary-600 mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Built for Fitness Enthusiasts
            </h2>
            <p className="text-gray-600 dark:text-dark-300 mb-8">
              Whether you're a beginner starting your fitness journey or an experienced athlete 
              tracking every detail, FitTrack Pro provides the tools you need to succeed.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              {[
                { number: "15+", label: "Default Exercises" },
                { number: "9", label: "Muscle Groups" },
                { number: "100%", label: "Free to Start" },
                { number: "24/7", label: "Track Anytime" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl font-bold text-primary-600">{stat.number}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Fitness Journey?
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            Join thousands of users who track their workouts with FitTrack Pro.
          </p>
          {user ? (
            <button onClick={() => navigate("/dashboard")} className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
              Go to Dashboard <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
              Get Started Free <ChevronRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </section>

      <footer className="bg-gray-900 dark:bg-dark-950 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-primary-400" />
              <span className="text-white font-semibold">FitTrack Pro</span>
            </div>
            <p className="text-sm">© 2024 FitTrack Pro. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Your data is secure and private</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
