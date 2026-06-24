import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Dumbbell, Calendar, Clock, Target, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { getWorkout, deleteWorkout } from "../services/workoutService";
import Card from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import ConfirmModal from "../components/common/ConfirmModal";
import { formatDate } from "../utils/helpers";

export default function WorkoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getWorkout(id)
      .then((data) => setWorkout(data.workout))
      .catch(() => {
        toast.error("Workout not found");
        navigate("/workouts");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteWorkout(id);
      toast.success("Workout deleted");
      navigate("/workouts");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size={40} />
      </div>
    );
  }

  if (!workout) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/workouts")} className="btn-ghost p-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">{workout.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/workouts/${id}/edit`} className="btn-ghost p-2">
            <Edit2 className="w-4 h-4" />
          </Link>
          <button onClick={() => setShowDelete(true)} className="btn-ghost p-2 text-red-500">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary-500" />
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="font-medium text-sm">{formatDate(workout.date)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="font-medium text-sm">{workout.duration} min</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-xs text-gray-500">Exercises</p>
              <p className="font-medium text-sm">{workout.exercises.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-xs text-gray-500">Volume</p>
              <p className="font-medium text-sm">{(workout.totalVolume / 1000).toFixed(1)}k lbs</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-4">Exercises</h2>
        <div className="space-y-3">
          {workout.exercises.map((ex, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <div className="flex items-center gap-3">
                <Dumbbell className="w-4 h-4 text-primary-500" />
                <div>
                  <p className="font-medium text-sm">{ex.name}</p>
                  <p className="text-xs text-gray-500">{ex.muscleGroup}</p>
                </div>
              </div>
              <div className="text-right text-sm">
                <p className="font-medium">
                  {ex.sets} × {ex.reps}
                </p>
                {ex.weight > 0 && (
                  <p className="text-xs text-gray-500">{ex.weight} lbs</p>
                )}
              </div>
            </div>
          ))}
        </div>
        {workout.notes && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Notes</p>
            <p className="text-sm">{workout.notes}</p>
          </div>
        )}
      </Card>

      <ConfirmModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Workout?"
        message="This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
}
