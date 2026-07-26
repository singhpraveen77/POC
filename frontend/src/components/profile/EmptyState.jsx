export default function EmptyState({ message }) {
  return (
    <div className="py-10 px-5 flex flex-col items-center justify-center text-gray-500 text-center">
      <p className="m-0 text-[15px]">{message}</p>
    </div>
  );
}
