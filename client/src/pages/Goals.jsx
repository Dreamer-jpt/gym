import { useState, useEffect } from "react";
import { Target, Plus, CheckCircle, Trash2, TrendingUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { getGoals, createGoal, updateGoal, completeGoal, deleteGoal } from "../services/goalService";
import { GOAL_TYPES } from "../constants";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";
import Modal from "../components/common/Modal";
import ConfirmModal from "../components/common/ConfirmModal";
import { formatDate, getProgressColor, getStatusColor } from "../utils/helpers";

const schema = z.object({
  type: z.string().min(1),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  targetValue: z.coerce.number().optional(),
  targetDate: z.string().optional(),
});

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const load = async () => {
    try {
      const data = await getGoals();
      setGoals(data.goals);
    } catch {
      toast.error("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openEdit = (goal) => {
    setEditGoal(goal);
    setValue("type", goal.type);
    setValue("title", goal.title);
    setValue("description", goal.description || "");
    setValue("targetValue", goal.targetValue || "");
    setValue("targetDate", goal.targetDate ? new Date(goal.targetDate).toISOString().split("T")[0] : "");
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editGoal) {
        await updateGoal(editGoal._id, data);
        toast.success("Goal updated!");
      } else {
        await createGoal(data);
        toast.success("Goal created!");
      }
      setShowModal(false);
      setEditGoal(null);
      reset();
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save goal");
    }
  };

  const handleComplete = async (id) => {
    setUpdatingId(id);
    try {
      await completeGoal(id);
      toast.success("Goal completed! 🎉");
      load();
    } catch {
      toast.error("Failed to update goal");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteGoal(deleteId);
      toast.success("Goal deleted");
      setDeleteId(null);
      load();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");

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
        <h1 className="text-2xl font-bold">Goals</h1>
        <button
          onClick={() => { setEditGoal(null); reset(); setShowModal(true); }}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Set Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals yet"
          description="Set your first fitness goal to start tracking your progress."
          action={
            <button
              onClick={() => { setEditGoal(null); reset(); setShowModal(true); }}
              className="btn-primary text-sm"
            >
              <Plus className="w-4 h-4" /> Set Goal
            </button>
          }
        />
      ) : (
        <>
          {activeGoals.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Active Goals</h2>
              {activeGoals.map((goal) => (
                <Card key={goal._id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{goal.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(goal.status)}`}>
                          {goal.status}
                        </span>
                      </div>
                      {goal.description && (
                        <p className="text-sm text-gray-500 dark:text-dark-400 mt-1">{goal.description}</p>
                      )}
                      {goal.targetDate && (
                        <p className="text-xs text-gray-400 mt-1">Target: {formatDate(goal.targetDate)}</p>
                      )}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span className={`font-medium ${getProgressColor(goal.progress)}`}>{goal.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              goal.progress >= 100 ? "bg-green-500" : goal.progress >= 50 ? "bg-yellow-500" : "bg-primary-500"
                            }`}
                            style={{ width: `${Math.min(goal.progress, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {goal.status === "active" && (
                        <button
                          onClick={() => handleComplete(goal._id)}
                          disabled={updatingId === goal._id}
                          className="btn-ghost text-green-500 hover:text-green-600 p-1"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button onClick={() => openEdit(goal)} className="btn-ghost p-1 text-sm">Edit</button>
                      <button onClick={() => setDeleteId(goal._id)} className="btn-ghost p-1 text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {completedGoals.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Completed Goals</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {completedGoals.map((goal) => (
                  <Card key={goal._id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <h3 className="font-medium text-sm">{goal.title}</h3>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block ${getStatusColor(goal.status)}`}>
                          {goal.status}
                        </span>
                      </div>
                      <button onClick={() => setDeleteId(goal._id)} className="btn-ghost p-1 text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditGoal(null); }} title={editGoal ? "Edit Goal" : "Set New Goal"} size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-1">Goal Type</label>
            <select className="input-field" {...register("type")}>
              {GOAL_TYPES.map((gt) => (
                <option key={gt.value} value={gt.value}>{gt.label}</option>
              ))}
            </select>
          </div>
          <Input label="Title" placeholder="e.g. Reach 170 lbs" error={errors.title?.message} {...register("title")} />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-1">Description</label>
            <textarea rows={2} className="input-field resize-none" {...register("description")} />
          </div>
          <Input label="Target Value" type="number" {...register("targetValue")} />
          <Input label="Target Date" type="date" {...register("targetDate")} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => { setShowModal(false); setEditGoal(null); }}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>{editGoal ? "Update Goal" : "Create Goal"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Goal?"
        message="This goal will be permanently removed."
        loading={deleting}
      />
    </div>
  );
}
