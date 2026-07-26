import { useSelector } from "react-redux";

export default function ProfileAvatar({ size = 100 }) {
  const user = useSelector((store) => store.auth?.user);
  const name = user?.name;
  const image = user?.profileImage;
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <div
      className="rounded-full bg-gray-300 text-white flex items-center justify-center font-bold select-none overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        backgroundImage: image ? `url(${image})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {image ? "" : initial}
    </div>
  );
}
