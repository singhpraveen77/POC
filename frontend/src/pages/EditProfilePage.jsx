import { useDispatch, useSelector } from "react-redux";
import MainLoader from "../components/loader/MainLoader";
import EditProfileForm from "../components/profile/EditProfileForm";
import { useEffect } from "react";
import { getProfile } from "../redux/profile/profileThunk";

export default function EditProfilePage() {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.profile);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await dispatch(getProfile()).unwrap();
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [dispatch]);

  if (loading && !profile) return <MainLoader message="Loading Profile..." />;

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">{error}</div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 text-center font-semibold">Profile not found.</div>
    );
  }

  return (
    <div className="flex-1 bg-[#f5f6fa] p-6 overflow-y-auto">
      <div className="max-w-[700px] mx-auto">
        <EditProfileForm user={profile.user} />
      </div>
    </div>
  );
}
