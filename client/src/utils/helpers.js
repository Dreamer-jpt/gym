export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

export const calculateVolume = (exercises) => {
  return exercises.reduce((total, ex) => total + (ex.weight || 0) * ex.sets * ex.reps, 0);
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export const getProgressColor = (progress) => {
  if (progress >= 100) return "text-green-500";
  if (progress >= 50) return "text-yellow-500";
  return "text-red-500";
};

export const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "beginner":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "intermediate":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "advanced":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700";
  }
};
