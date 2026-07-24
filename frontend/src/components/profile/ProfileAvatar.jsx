import { useSelector } from "react-redux";

export default function ProfileAvatar({ size = 100 }) {
  const user = useSelector((store) => store.profile?.profile?.user);

  const name = user?.name;
  const image = user?.profileImage;

  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "lightgrey",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,      // scales the initial with the size
        fontWeight: "700",
        userSelect: "none",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        backgroundImage: image ? `url(${image})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {image ? "" : initial}
    </div>
  );
}