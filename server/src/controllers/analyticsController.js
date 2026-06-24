const Workout = require("../models/Workout");
const Progress = require("../models/Progress");
const Goal = require("../models/Goal");

exports.getOverview = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalWorkouts = await Workout.countDocuments({ userId });
    const totalGoals = await Goal.countDocuments({ userId });
    const completedGoals = await Goal.countDocuments({ userId, status: "completed" });

    const volumeAgg = await Workout.aggregate([
      { $match: { userId } },
      { $group: { _id: null, totalVolume: { $sum: "$totalVolume" }, totalCalories: { $sum: "$caloriesBurned" }, totalDuration: { $sum: "$duration" } } },
    ]);

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyWorkouts = await Workout.countDocuments({
      userId,
      date: { $gte: startOfWeek },
    });

    res.json({
      totalWorkouts,
      totalGoals,
      completedGoals,
      totalVolume: volumeAgg[0]?.totalVolume || 0,
      totalCalories: volumeAgg[0]?.totalCalories || 0,
      totalDuration: volumeAgg[0]?.totalDuration || 0,
      weeklyWorkouts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVolume = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const data = await Workout.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalVolume: { $sum: "$totalVolume" },
          count: { $sum: 1 },
          totalCalories: { $sum: "$caloriesBurned" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMuscleGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const data = await Workout.aggregate([
      { $match: { userId } },
      { $unwind: "$exercises" },
      {
        $group: {
          _id: "$exercises.muscleGroup",
          count: { $sum: 1 },
          totalVolume: { $sum: { $multiply: ["$exercises.weight", "$exercises.sets", "$exercises.reps"] } },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWeightProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    const data = await Progress.find({ userId })
      .select("weight date bodyFat")
      .sort({ date: 1 });

    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPersonalRecords = async (req, res) => {
  try {
    const userId = req.user._id;

    const records = await Workout.aggregate([
      { $match: { userId } },
      { $unwind: "$exercises" },
      {
        $group: {
          _id: "$exercises.name",
          maxWeight: { $max: "$exercises.weight" },
          maxReps: { $max: "$exercises.reps" },
          bestVolume: {
            $max: {
              $multiply: ["$exercises.weight", "$exercises.sets", "$exercises.reps"],
            },
          },
          totalSets: { $sum: "$exercises.sets" },
          totalReps: { $sum: "$exercises.reps" },
          timesPerformed: { $sum: 1 },
          muscleGroup: { $first: "$exercises.muscleGroup" },
        },
      },
      { $sort: { maxWeight: -1 } },
    ]);

    const recentPRs = records.filter((r) => r.maxWeight > 0).slice(0, 10);

    res.json({ records, recentPRs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
