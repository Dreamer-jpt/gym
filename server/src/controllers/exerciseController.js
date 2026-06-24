const Exercise = require("../models/Exercise");

exports.getExercises = async (req, res) => {
  try {
    const { muscleGroup, search } = req.query;
    const query = {
      $or: [{ isCustom: false }, { userId: req.user._id }],
    };

    if (muscleGroup) {
      query.muscleGroup = muscleGroup;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const exercises = await Exercise.find(query).sort({ name: 1 });
    res.json({ exercises });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findOne({
      _id: req.params.id,
      $or: [{ isCustom: false }, { userId: req.user._id }],
    });
    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }
    res.json({ exercise });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createExercise = async (req, res) => {
  try {
    const exercise = await Exercise.create({
      ...req.validatedBody,
      isCustom: true,
      userId: req.user._id,
    });
    res.status(201).json({ exercise });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Exercise already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.updateExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id, isCustom: true },
      req.validatedBody,
      { new: true, runValidators: true }
    );
    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found or cannot be edited" });
    }
    res.json({ exercise });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
      isCustom: true,
    });
    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found or cannot be deleted" });
    }
    res.json({ message: "Exercise deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
