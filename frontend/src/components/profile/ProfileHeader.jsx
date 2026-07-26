import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import ProfileAvatar from "./ProfileAvatar";

export default function ProfileHeader({ user }) {
  const navigate = useNavigate();

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-xl p-6 flex items-center justify-between gap-6 border border-gray-200">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-[30px] font-bold text-white">
          <ProfileAvatar size={80} />
        </div>

        <div>
          <h2 className="m-0 text-[26px] font-bold">{user.name}</h2>
          <p className="my-1.5 text-gray-500">@{user.username}</p>
          <p className="my-1.5 text-gray-500">{user.email}</p>

          <div className="flex gap-2.5 mt-2.5 items-center">
            <span className={`px-2.5 py-1 rounded-full text-[13px] font-semibold ${user.isVerified ? "text-green-700" : "text-red-600"}`}>
              {user.isVerified ? "✓ Verified" : "✗ Not Verified"}
            </span>
            <span className="text-[13px] text-gray-500">Joined {joinedDate}</span>
          </div>
        </div>
      </div>

      <Button variant="solid" size="md" onClick={() => navigate('/editProfilePage')}>
        Edit Profile
      </Button>
    </div>
  );
}
