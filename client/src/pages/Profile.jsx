import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Save, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { deleteAccount } from "../services/userService";
import api from "../services/api";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import ConfirmModal from "../components/common/ConfirmModal";
import { FITNESS_GOALS } from "../constants";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || "",
    gender: user?.gender || "",
    age: user?.age || "",
    height: user?.height || "",
    weight: user?.weight || "",
    fitnessGoal: user?.fitnessGoal || "general_fitness",
  });
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/users/profile", form);
      toast.success("Profile updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      toast.success("Account deleted");
      logout();
      navigate("/");
    } catch {
      toast.error("Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profile Settings</h1>

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-1">Gender</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="input-field">
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Input label="Age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Height (in)" type="number" step="0.1" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} />
            <Input label="Weight (lbs)" type="number" step="0.1" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-1">Fitness Goal</label>
            <select value={form.fitnessGoal} onChange={(e) => setForm({ ...form, fitnessGoal: e.target.value })} className="input-field">
              {FITNESS_GOALS.map((fg) => (
                <option key={fg.value} value={fg.value}>{fg.label}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={saving}><Save className="w-4 h-4" /> Save Changes</Button>
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-500 dark:text-dark-400 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button variant="danger" onClick={() => setShowDelete(true)}>
          <AlertTriangle className="w-4 h-4" /> Delete Account
        </Button>
      </Card>

      <ConfirmModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account?"
        message="This will permanently delete all your data including workouts, progress, and goals."
        loading={deleting}
      />
    </div>
  );
}
