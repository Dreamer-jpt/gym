import { useState, useEffect } from "react";
import { Dumbbell, Flame, Zap, Trophy } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getWorkoutSummary } from "../services/workoutService";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import StatsCard from "../components/dashboard/StatsCard";
import QuickActions from "../components/dashboard/QuickActions";
import RecentWorkouts from "../components/dashboard/RecentWorkouts";
import Spinner from "../components/common/Spinner";

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getWorkoutSummary();
        setSummary(data);
      } catch {
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeCard name={user?.name || "Athlete"} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Dumbbell}
          label="Total Workouts"
          value={summary?.totalWorkouts || 0}
          subtext={summary?.weeklyWorkouts ? `${summary.weeklyWorkouts} this week` : "No workouts yet"}
          color="primary"
        />
        <StatsCard
          icon={Zap}
          label="Total Volume"
          value={summary?.totalVolume ? `${(summary.totalVolume / 1000).toFixed(1)}k` : 0}
          subtext="lbs lifted"
          color="green"
        />
        <StatsCard
          icon={Flame}
          label="Calories Burned"
          value={summary?.totalCalories?.toLocaleString() || 0}
          subtext="estimated"
          color="orange"
        />
        <StatsCard
          icon={Trophy}
          label="Current Streak"
          value={`${summary?.streak || 0}`}
          subtext={summary?.streak === 1 ? "day" : "days"}
          color="purple"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentWorkouts workouts={summary?.recentWorkouts} />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}
