import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { createWorkout, getWorkout, updateWorkout } from "../services/workoutService";
import { MUSCLE_GROUPS } from "../constants";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  duration: z.coerce.number().min(0, "Duration must be positive"),
  notes: z.string().optional(),
  exercises: z.array(z.object({
    name: z.string().min(1, "Exercise name is required"),
    muscleGroup: z.string().min(1, "Muscle group is required"),
    sets: z.coerce.number().min(1, "Min 1 set"),
    reps: z.coerce.number().min(1, "Min 1 rep"),
    weight: z.coerce.number().min(0, "Weight must be 0 or more"),
    duration: z.coerce.number().optional(),
    notes: z.string().optional(),
  })).min(1, "Add at least one exercise"),
});

export default function WorkoutForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      date: new Date().toISOString().split("T")[0],
      duration: 30,
      notes: "",
      exercises: [{ name: "", muscleGroup: "Chest", sets: 3, reps: 10, weight: 0, duration: "", notes: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "exercises" });

  useEffect(() => {
    if (isEdit) {
      getWorkout(id).then((data) => {
        const w = data.workout;
        reset({
          title: w.title,
          date: new Date(w.date).toISOString().split("T")[0],
          duration: w.duration,
          notes: w.notes || "",
          exercises: w.exercises.map((e) => ({
            name: e.name,
            muscleGroup: e.muscleGroup,
            sets: e.sets,
            reps: e.reps,
            weight: e.weight,
            duration: e.duration || "",
            notes: e.notes || "",
          })),
        });
        setLoading(false);
      }).catch(() => {
        toast.error("Failed to load workout");
        navigate("/workouts");
      });
    }
  }, [id]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateWorkout(id, data);
        toast.success("Workout updated!");
      } else {
        await createWorkout(data);
        toast.success("Workout logged!");
      }
      navigate("/workouts");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save workout");
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/workouts")} className="btn-ghost p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">{isEdit ? "Edit Workout" : "New Workout"}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <div className="grid gap-4">
            <Input
              label="Workout Title"
              placeholder="e.g. Upper Body Push"
              error={errors.title?.message}
              {...register("title")}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date"
                type="date"
                error={errors.date?.message}
                {...register("date")}
              />
              <Input
                label="Duration (minutes)"
                type="number"
                error={errors.duration?.message}
                {...register("duration")}
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Exercises</h2>
            <Button
              type="button"
              variant="secondary"
              onClick={() => append({ name: "", muscleGroup: "Chest", sets: 3, reps: 10, weight: 0, duration: "", notes: "" })}
            >
              <Plus className="w-4 h-4" /> Add Exercise
            </Button>
          </div>
          {errors.exercises?.message && (
            <p className="text-sm text-red-500 mb-4">{errors.exercises.message}</p>
          )}
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Exercise {index + 1}</span>
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      placeholder="Exercise name"
                      className="input-field"
                      {...register(`exercises.${index}.name`)}
                    />
                    {errors.exercises?.[index]?.name && (
                      <p className="text-xs text-red-500 mt-1">{errors.exercises[index].name.message}</p>
                    )}
                  </div>
                  <div>
                    <select className="input-field" {...register(`exercises.${index}.muscleGroup`)}>
                      {MUSCLE_GROUPS.map((mg) => (
                        <option key={mg} value={mg}>{mg}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <input type="number" placeholder="Sets" className="input-field" {...register(`exercises.${index}.sets`)} />
                  </div>
                  <div>
                    <input type="number" placeholder="Reps" className="input-field" {...register(`exercises.${index}.reps`)} />
                  </div>
                  <div>
                    <input type="number" placeholder="Weight" className="input-field" {...register(`exercises.${index}.weight`)} />
                  </div>
                  <div>
                    <input type="number" placeholder="Duration" className="input-field" {...register(`exercises.${index}.duration`)} />
                  </div>
                </div>
                <input placeholder="Notes (optional)" className="input-field" {...register(`exercises.${index}.notes`)} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-1">Notes</label>
            <textarea
              rows={3}
              placeholder="Workout notes..."
              className="input-field resize-none"
              {...register("notes")}
            />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate("/workouts")}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            <Save className="w-4 h-4" /> {isEdit ? "Update Workout" : "Save Workout"}
          </Button>
        </div>
      </form>
    </div>
  );
}
