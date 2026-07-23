import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ProfileStats from "../components/Profile/ProfileStats";
import RecentWorkspaces from "../components/Profile/RecentWorkspaces";
import RecentBoards from "../components/Profile/RecentBoards";
import RecentTasks from "../components/Profile/RecentTasks";
import ProfileHeader from "../components/profile/ProfileHeader";
import { getProfile } from "../redux/profile/profileThunk";
import MainLoader from "../components/loader/MainLoader";

// import { getProfile } from "../../redux/profile/profileThunk";

export default function ProfilePage() {
 const dispatch = useDispatch();

  const { profile, loading, error } = useSelector(
    (state) => state.profile
  );

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

  if (loading) return <MainLoader message="Loading Profile..." />;

  if (error) return <div>{error}</div>;

  if (!profile) {
  return <div>No profile found.</div>;
}


  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        background: "#f5f6fa",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <ProfileHeader user={profile.user} />

        <ProfileStats stats={profile.stats} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))",
            gap: 24,
          }}
        >
          <RecentWorkspaces
            workspaces={profile.recentWorkspaces}
          />

          <RecentBoards
            boards={profile.recentBoards}
          />
        </div>

        <RecentTasks
          tasks={profile.recentTasks}
        />
      </div>
    </div>
  );
}