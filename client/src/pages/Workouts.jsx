import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Search, Filter, Dumbbell, Calendar, Clock, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { getWorkouts, deleteWorkout } from "../services/workoutService";
import { MUSCLE_GROUPS } from "../constants";
import Card from "../components/common/Card";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";
import ConfirmModal from "../components/common/ConfirmModal";
import { formatDate } from "../utils/helpers";

export default function Workouts() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [date, setDate] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (muscleGroup) params.muscleGroup = muscleGroup;
      if (date) params.date = date;
      const data = await getWorkouts(params);
      setWorkouts(data.workouts);
      setPagination(data.pagination);
    } catch {
      toast.error("Failed to load workouts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteWorkout(deleteId);
      toast.success("Workout deleted");
      setDeleteId(null);
      load();
    } catch {
      toast.error("Failed to delete workout");
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workouts</h1>
        <Link to="/workouts/new" className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Workout
        </Link>
      </div>

      <Card>
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search workouts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={muscleGroup}
            onChange={(e) => { setMuscleGroup(e.target.value); setPage(1); }}
            className="input-field w-auto"
          >
            <option value="">All Groups</option>
            {MUSCLE_GROUPS.map((mg) => (
              <option key={mg} value={mg}>{mg}</option>
            ))}
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); setPage(1); }}
            className="input-field w-auto"
          />
          <button type="submit" className="btn-primary text-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </form>
      </Card>

      {workouts.length === 0 ? (
        <EmptyState
          icon={Dumbbell}
          title="No workouts found"
          description={search || muscleGroup || date ? "Try adjusting your filters." : "Log your first workout to start tracking."}
          action={
            <Link to="/workouts/new" className="btn-primary text-sm">
              <Plus className="w-4 h-4" /> Log Workout
            </Link>
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {workouts.map((workout) => (
              <Card key={workout._id} hover>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <Dumbbell className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <Link to={`/workouts/${workout._id}`} className="font-semibold hover:text-primary-600 transition-colors">
                        {workout.title}
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-dark-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {formatDate(workout.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {workout.duration} min
                        </span>
                        <span>{workout.exercises.length} exercises</span>
                        <span className="font-medium text-primary-600">
                          {(workout.totalVolume / 1000).toFixed(1)}k lbs
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/workouts/${workout._id}`)}
                      className="btn-ghost text-sm"
                    >
                      View <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(workout._id)}
                      className="btn-ghost text-sm text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded text-sm ${
                    page === p
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Workout?"
        message="This action cannot be undone. All workout data will be permanently removed."
        loading={deleting}
      />
    </div>
  );
}
