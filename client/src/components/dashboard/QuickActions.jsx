import { useNavigate } from "react-router-dom";
import { Plus, BookOpen, TrendingUp, Target } from "lucide-react";
import Card from "../common/Card";

const actions = [
  { label: "Log Workout", icon: Plus, path: "/workouts/new", color: "text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400" },
  { label: "Add Exercise", icon: BookOpen, path: "/exercises", color: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400" },
  { label: "Body Measurement", icon: TrendingUp, path: "/progress", color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400" },
  { label: "Set Goal", icon: Target, path: "/goals", color: "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400" },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-100 dark:border-dark-700 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
          >
            <div className={`p-2 rounded-lg ${action.color}`}>
              <action.icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-dark-200">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}
