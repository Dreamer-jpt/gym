const Goal = require("../models/Goal");

exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ goals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createGoal = async (req, res) => {
  try {
    const goal = await Goal.create({
      ...req.validatedBody,
      userId: req.user._id,
    });
    res.status(201).json({ goal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    res.json({ goal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status: "completed", progress: 100 },
      { new: true }
    );
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    res.json({ goal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    res.json({ message: "Goal deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
