export default function ProfileInfoCard({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-gray-200">
      {title && (
        <div className="mb-6">
          <h2 className="m-0 text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && (
            <p className="mt-2 mb-0 text-gray-500 text-sm">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
