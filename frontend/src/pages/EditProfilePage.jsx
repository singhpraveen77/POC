import { useSelector } from "react-redux";

// import MainLoader from "../../components/common/MainLoader";
// import EditProfileForm from "../../components/Profile/EditProfileForm";
import MainLoader from "../components/loader/MainLoader";
import EditProfileForm from "../components/profile/EditProfileForm";

export default function EditProfilePage() {
  const { profile, loading, error } = useSelector(
    (state) => state.profile
  );

  if (loading && !profile) {
    return <MainLoader message="Loading Profile..." />;
  }

  if (error) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "red",
          fontWeight: 600,
        }}
      >
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          fontWeight: 600,
        }}
      >
        Profile not found.
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        background: "#f5f6fa",
        padding: "24px",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <EditProfileForm user={profile.user} />
      </div>
    </div>
  );
}