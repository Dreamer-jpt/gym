const Workout = require("../models/Workout");

exports.getWorkouts = async (req, res) => {
  try {
    const { page = 1, limit = 10, date, muscleGroup, search } = req.query;
    const query = { userId: req.user._id };

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }

    if (muscleGroup) {
      query["exercises.muscleGroup"] = muscleGroup;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { "exercises.name": { $regex: search, $options: "i" } },
      ];
    }

    const total = await Workout.countDocuments(query);
    const workouts = await Workout.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      workouts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.json({ workout });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createWorkout = async (req, res) => {
  try {
    const workout = await Workout.create({
      ...req.validatedBody,
      userId: req.user._id,
    });
    res.status(201).json({ workout });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.validatedBody,
      { new: true, runValidators: true }
    );
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.json({ workout });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.json({ message: "Workout deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalWorkouts = await Workout.countDocuments({ userId });

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyWorkouts = await Workout.countDocuments({
      userId,
      date: { $gte: startOfWeek },
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayWorkout = await Workout.findOne({
      userId,
      date: { $gte: todayStart },
    }).sort({ date: -1 });

    const allWorkouts = await Workout.find({ userId }).sort({ date: -1 });
    let streak = 0;
    if (allWorkouts.length > 0) {
      const checkDate = new Date();
      checkDate.setHours(0, 0, 0, 0);
      for (const w of allWorkouts) {
        const wDate = new Date(w.date);
        wDate.setHours(0, 0, 0, 0);
        const diff = Math.round((checkDate - wDate) / (1000 * 60 * 60 * 24));
        if (diff === streak) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (diff > streak) {
          break;
        }
      }
    }

    const volumeAgg = await Workout.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, totalVolume: { $sum: "$totalVolume" }, totalCalories: { $sum: "$caloriesBurned" } } },
    ]);

    const totalVolume = volumeAgg[0]?.totalVolume || 0;
    const totalCalories = volumeAgg[0]?.totalCalories || 0;

    const recentWorkouts = allWorkouts.slice(0, 5);

    res.json({
      totalWorkouts,
      weeklyWorkouts,
      currentWorkout: todayWorkout,
      streak,
      totalVolume,
      totalCalories,
      recentWorkouts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
