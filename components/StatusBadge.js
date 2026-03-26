export default function StatusBadge({ status }) {
  const statusStyles = {
    Active: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    Blocked: "bg-rose-100 text-rose-700 ring-1 ring-rose-200"
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}>{status}</span>;
}
