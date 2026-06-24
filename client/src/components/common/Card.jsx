export default function Card({ children, className = "", hover = false, ...props }) {
  return (
    <div
      className={`card p-6 ${hover ? "card-hover" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
