import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Dumbbell } from "lucide-react";
import toast from "react-hot-toast";
import { getExercise } from "../services/exerciseService";
import Card from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import { getDifficultyColor } from "../utils/helpers";

export default function ExerciseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExercise(id)
      .then((data) => setExercise(data.exercise))
      .catch(() => {
        toast.error("Exercise not found");
        navigate("/exercises");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size={40} />
      </div>
    );
  }

  if (!exercise) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/exercises")} className="btn-ghost p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">{exercise.name}</h1>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
            <Dumbbell className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-dark-400">{exercise.muscleGroup}</p>
            <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(exercise.difficulty)}`}>
              {exercise.difficulty}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-dark-400">Muscle Group</p>
            <p className="font-medium">{exercise.muscleGroup}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-dark-400">Equipment</p>
            <p className="font-medium">{exercise.equipment || "None"}</p>
          </div>
        </div>

        {exercise.instructions && (
          <div>
            <h3 className="font-semibold mb-2">Instructions</h3>
            <p className="text-gray-600 dark:text-dark-300 text-sm leading-relaxed">
              {exercise.instructions}
            </p>
          </div>
        )}

        {exercise.isCustom && (
          <p className="mt-4 text-xs text-gray-400">Custom exercise</p>
        )}
      </Card>
    </div>
  );
}
