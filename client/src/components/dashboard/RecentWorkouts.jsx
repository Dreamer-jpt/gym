import { useNavigate } from "react-router-dom";
import { Dumbbell, Clock, ArrowRight } from "lucide-react";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import { formatDate } from "../../utils/helpers";

export default function RecentWorkouts({ workouts }) {
  const navigate = useNavigate();

  if (!workouts || workouts.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={Dumbbell}
          title="No workouts yet"
          description="Log your first workout to start tracking your progress."
          action={
            <button onClick={() => navigate("/workouts/new")} className="btn-primary text-sm">
              Log Your First Workout
            </button>
          }
        />
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Workouts</h2>
        <button
          onClick={() => navigate("/workouts")}
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          View all <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-3">
        {workouts.map((workout) => (
          <button
            key={workout._id}
            onClick={() => navigate(`/workouts/${workout._id}`)}
            className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors text-left"
          >
            <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <Dumbbell className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{workout.title}</p>
              <p className="text-xs text-gray-500 dark:text-dark-400">
                {workout.exercises.length} exercises
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-dark-400">{formatDate(workout.date)}</p>
              <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-dark-500">
                <Clock className="w-3 h-3" />
                {workout.duration}min
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
