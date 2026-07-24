import { useNavigate } from "react-router-dom";
import Button from "../common/Button";

export default function ProfileHeader({ user }) {

    const navigate=useNavigate();
    const  handleEditProfile=()=>{
        navigate('/editProfilePage')
    }
  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "lightgrey",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            {user.name}
          </h2>

          <p
            style={{
              margin: "6px 0",
              color: "#6b7280",
            }}
          >
            @{user.username}
          </p>

          <p
            style={{
              margin: "6px 0",
              color: "#6b7280",
            }}
          >
            {user.email}
          </p>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 10,
              alignItems: "center",
            }}
          >
            <span
              style={{
                padding: "4px 10px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                background: user.isVerified
                  ? "#dcfce7"
                  : "#fee2e2",
                color: user.isVerified
                  ? "#15803d"
                  : "#dc2626",
              }}
            >
              {user.isVerified ? "✓ Verified" : "✗ Not Verified"}
            </span>

            <span
              style={{
                fontSize: 13,
                color: "#6b7280",
              }}
            >
              Joined {joinedDate}
            </span>
          </div>
        </div>
      </div>

      <Button
        variant="solid"
        size="md"
        onClick={handleEditProfile} // or navigate to edit profile
        >
        Edit Profile
        </Button>
    </div>
  );
}