import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, BookOpen, Dumbbell, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { getExercises, createExercise, deleteExercise } from "../services/exerciseService";
import { MUSCLE_GROUPS, DIFFICULTY_LEVELS } from "../constants";
import Card from "../components/common/Card";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";
import Modal from "../components/common/Modal";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import ConfirmModal from "../components/common/ConfirmModal";
import { getDifficultyColor } from "../utils/helpers";

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    muscleGroup: "Chest",
    equipment: "",
    difficulty: "beginner",
    instructions: "",
  });

  const load = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (muscleGroup) params.muscleGroup = muscleGroup;
      const data = await getExercises(params);
      setExercises(data.exercises);
    } catch {
      toast.error("Failed to load exercises");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createExercise(form);
      toast.success("Exercise created");
      setShowModal(false);
      setForm({ name: "", muscleGroup: "Chest", equipment: "", difficulty: "beginner", instructions: "" });
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteExercise(deleteId);
      toast.success("Exercise deleted");
      setDeleteId(null);
      load();
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Exercise Library</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Exercise
        </button>
      </div>

      <Card>
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={muscleGroup}
            onChange={(e) => { setMuscleGroup(e.target.value); }}
            className="input-field w-auto"
          >
            <option value="">All Groups</option>
            {MUSCLE_GROUPS.map((mg) => (
              <option key={mg} value={mg}>{mg}</option>
            ))}
          </select>
          <button type="submit" className="btn-primary text-sm">Search</button>
        </form>
      </Card>

      {exercises.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No exercises found"
          description="Try a different search or add a new exercise."
          action={
            <button onClick={() => setShowModal(true)} className="btn-primary text-sm">
              <Plus className="w-4 h-4" /> Add Exercise
            </button>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map((exercise) => (
            <Card key={exercise._id} hover>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <Dumbbell className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <Link
                      to={`/exercises/${exercise._id}`}
                      className="font-medium hover:text-primary-600 transition-colors"
                    >
                      {exercise.name}
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-dark-400 mt-0.5">
                      {exercise.muscleGroup}
                    </p>
                    <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </span>
                  </div>
                </div>
                <Link to={`/exercises/${exercise._id}`} className="btn-ghost p-1">
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              {exercise.isCustom && (
                <button
                  onClick={() => setDeleteId(exercise._id)}
                  className="mt-3 text-xs text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Exercise" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Exercise Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-1">Muscle Group</label>
            <select
              value={form.muscleGroup}
              onChange={(e) => setForm({ ...form, muscleGroup: e.target.value })}
              className="input-field"
            >
              {MUSCLE_GROUPS.map((mg) => (
                <option key={mg} value={mg}>{mg}</option>
              ))}
            </select>
          </div>
          <Input
            label="Equipment"
            value={form.equipment}
            onChange={(e) => setForm({ ...form, equipment: e.target.value })}
            placeholder="e.g. Barbell, Dumbbells, Machine"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-1">Difficulty</label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              className="input-field"
            >
              {DIFFICULTY_LEVELS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-1">Instructions</label>
            <textarea
              rows={3}
              value={form.instructions}
              onChange={(e) => setForm({ ...form, instructions: e.target.value })}
              className="input-field resize-none"
              placeholder="How to perform this exercise..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Create Exercise</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Exercise?"
        message="This custom exercise will be permanently removed."
        loading={deleting}
      />
    </div>
  );
}
