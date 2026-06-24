import { useState, useEffect } from "react";
import { BarChart3, Dumbbell, TrendingUp, Target } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import toast from "react-hot-toast";
import { getOverview, getVolume, getMuscleGroups, getWeightProgress, getPersonalRecords } from "../services/analyticsService";
import Card from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import { CHART_COLORS, MUSCLE_GROUPS } from "../constants";

export default function Analytics() {
  const [overview, setOverview] = useState(null);
  const [volumeData, setVolumeData] = useState([]);
  const [muscleData, setMuscleData] = useState([]);
  const [weightData, setWeightData] = useState([]);
  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [ov, vol, mg, wp, pr] = await Promise.all([
          getOverview(),
          getVolume(30),
          getMuscleGroups(),
          getWeightProgress(),
          getPersonalRecords(),
        ]);
        setOverview(ov);
        setVolumeData(vol.data);
        setMuscleData(mg.data);
        setWeightData(wp.data);
        setPrs(pr.recentPRs);
      } catch {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size={40} />
      </div>
    );
  }

  const hasData = overview && overview.totalWorkouts > 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <Dumbbell className="w-5 h-5 text-primary-500" />
            <div>
              <p className="text-xs text-gray-500">Total Workouts</p>
              <p className="text-xl font-bold">{overview?.totalWorkouts || 0}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-xs text-gray-500">This Week</p>
              <p className="text-xl font-bold">{overview?.weeklyWorkouts || 0}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-xs text-gray-500">Goals Completed</p>
              <p className="text-xl font-bold">{overview?.completedGoals || 0}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-xs text-gray-500">Total Volume</p>
              <p className="text-xl font-bold">{overview?.totalVolume ? `${(overview.totalVolume / 1000).toFixed(1)}k` : "0"}</p>
            </div>
          </div>
        </Card>
      </div>

      {!hasData ? (
        <EmptyState
          icon={BarChart3}
          title="No analytics data yet"
          description="Complete some workouts to see your analytics and progress charts."
        />
      ) : (
        <>
          <div className="grid lg:grid-cols-2 gap-6">
            {volumeData.length > 0 && (
              <Card>
                <h2 className="text-lg font-semibold mb-4">Volume Over Time</h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={volumeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#fff" }} />
                      <Bar dataKey="totalVolume" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Volume (lbs)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            {muscleData.length > 0 && (
              <Card>
                <h2 className="text-lg font-semibold mb-4">Muscle Group Distribution</h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={muscleData}
                        dataKey="count"
                        nameKey="_id"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
                      >
                        {muscleData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#fff" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}
          </div>

          {weightData.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold mb-4">Weight Progress</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightData.map((w) => ({ date: new Date(w.date).toLocaleDateString(), weight: w.weight }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#fff" }} />
                    <Line type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {prs.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold mb-4">Personal Records</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-dark-700">
                      <th className="text-left py-3 font-medium">Exercise</th>
                      <th className="text-right py-3 font-medium">Best Weight</th>
                      <th className="text-right py-3 font-medium">Best Volume</th>
                      <th className="text-right py-3 font-medium">Max Reps</th>
                      <th className="text-right py-3 font-medium">Times Done</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prs.map((pr, i) => (
                      <tr key={i} className="border-b border-gray-50 dark:border-dark-700/50">
                        <td className="py-3 font-medium">{pr._id}</td>
                        <td className="py-3 text-right">{pr.maxWeight > 0 ? `${pr.maxWeight} lbs` : "-"}</td>
                        <td className="py-3 text-right">{pr.bestVolume?.toLocaleString() || "-"}</td>
                        <td className="py-3 text-right">{pr.maxReps}</td>
                        <td className="py-3 text-right">{pr.timesPerformed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
