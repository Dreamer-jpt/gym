import Card from "../common/Card";
import { getGreeting } from "../../utils/helpers";

export default function WelcomeCard({ name }) {
  return (
    <Card className="bg-gradient-to-r from-primary-600 to-primary-800 text-white border-none">
      <div>
        <h1 className="text-2xl font-bold">
          {getGreeting()}, {name}!
        </h1>
        <p className="text-primary-100 mt-1">Let's crush your fitness goals today.</p>
      </div>
    </Card>
  );
}
