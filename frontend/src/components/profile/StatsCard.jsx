export default function StatsCard({ title, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-2 min-h-[100px] justify-center">
      <span className="text-sm text-gray-500 font-medium">{title}</span>
      <span className="text-[32px] font-bold text-gray-900">{value}</span>
    </div>
  );
}
