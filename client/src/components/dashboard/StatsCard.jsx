import Card from "../common/Card";

export default function StatsCard({ icon: Icon, label, value, subtext, color = "primary" }) {
  const colors = {
    primary: "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400",
    green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    red: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  };

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-dark-400">{label}</p>
          <p className="text-2xl font-bold mt-1">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {subtext && (
            <p className="text-xs text-gray-400 dark:text-dark-500 mt-1">{subtext}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colors[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </Card>
  );
}
