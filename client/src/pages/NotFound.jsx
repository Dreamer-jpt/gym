import { Link } from "react-router-dom";
import { Home, Dumbbell } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <Dumbbell className="w-16 h-16 text-primary-600 mx-auto mb-6" />
        <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white mb-4">404</h1>
        <p className="text-lg text-gray-600 dark:text-dark-300 mb-8">
          Page not found. The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <Home className="w-4 h-4" /> Go Home
        </Link>
      </div>
    </div>
  );
}
