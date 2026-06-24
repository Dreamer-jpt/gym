import { useState, useEffect } from "react";
import { TrendingUp, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import toast from "react-hot-toast";
import { getProgress, createProgress, deleteProgress } from "../services/progressService";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";
import Modal from "../components/common/Modal";
import ConfirmModal from "../components/common/ConfirmModal";
import { formatDate } from "../utils/helpers";

const schema = z.object({
  weight: z.coerce.number().min(1, "Weight is required"),
  bodyFat: z.coerce.number().optional(),
  chest: z.coerce.number().optional(),
  waist: z.coerce.number().optional(),
  hips: z.coerce.number().optional(),
  arms: z.coerce.number().optional(),
  thighs: z.coerce.number().optional(),
});

export default function Progress() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const load = async () => {
    try {
      const data = await getProgress({ page, limit: 10 });
      setRecords(data.records);
      setPagination(data.pagination);
    } catch {
      toast.error("Failed to load progress");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page]);

  const onSubmit = async (data) => {
    try {
      await createProgress(data);
      toast.success("Measurement recorded!");
      setShowModal(false);
      reset();
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProgress(deleteId);
      toast.success("Record deleted");
      setDeleteId(null);
      load();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const chartData = [...records].reverse().map((r) => ({
    date: formatDate(r.date),
    weight: r.weight,
    bodyFat: r.bodyFat,
    chest: r.chest,
    waist: r.waist,
    arms: r.arms,
    thighs: r.thighs,
  }));

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
        <h1 className="text-2xl font-bold">Body Progress</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Measurement
        </button>
      </div>

      {records.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold mb-4">Weight Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Weight (lbs)" />
                {chartData[0]?.bodyFat && (
                  <Line type="monotone" dataKey="bodyFat" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} name="Body Fat %" />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {records.length > 1 && (
        <Card>
          <h2 className="text-lg font-semibold mb-4">Measurements Over Time</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                {chartData[0]?.chest && <Line type="monotone" dataKey="chest" stroke="#8b5cf6" strokeWidth={2} name="Chest" />}
                {chartData[0]?.waist && <Line type="monotone" dataKey="waist" stroke="#f59e0b" strokeWidth={2} name="Waist" />}
                {chartData[0]?.arms && <Line type="monotone" dataKey="arms" stroke="#ec4899" strokeWidth={2} name="Arms" />}
                {chartData[0]?.thighs && <Line type="monotone" dataKey="thighs" stroke="#14b8a6" strokeWidth={2} name="Thighs" />}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {records.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No progress records yet"
          description="Add your first body measurement to start tracking your progress."
          action={
            <button onClick={() => setShowModal(true)} className="btn-primary text-sm">
              <Plus className="w-4 h-4" /> Add Measurement
            </button>
          }
        />
      ) : (
        <>
          <Card>
            <h2 className="text-lg font-semibold mb-4">Measurement History</h2>
            <div className="space-y-2">
              {records.map((r) => (
                <div key={r._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{formatDate(r.date)}</p>
                    <p className="text-xs text-gray-500">
                      Weight: {r.weight} lbs{ r.bodyFat ? ` | Body Fat: ${r.bodyFat}%` : "" }
                    </p>
                  </div>
                  <button onClick={() => setDeleteId(r._id)} className="text-red-500 hover:text-red-600 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 rounded text-sm ${page === p ? "bg-primary-600 text-white" : "bg-gray-100 dark:bg-dark-700"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Measurement" size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Weight (lbs)" type="number" step="0.1" error={errors.weight?.message} {...register("weight")} />
          <Input label="Body Fat %" type="number" step="0.1" error={errors.bodyFat?.message} {...register("bodyFat")} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Chest (in)" type="number" step="0.1" {...register("chest")} />
            <Input label="Waist (in)" type="number" step="0.1" {...register("waist")} />
            <Input label="Hips (in)" type="number" step="0.1" {...register("hips")} />
            <Input label="Arms (in)" type="number" step="0.1" {...register("arms")} />
            <Input label="Thighs (in)" type="number" step="0.1" {...register("thighs")} />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>Save Measurement</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Record?"
        message="This measurement will be permanently removed."
        loading={deleting}
      />
    </div>
  );
}
