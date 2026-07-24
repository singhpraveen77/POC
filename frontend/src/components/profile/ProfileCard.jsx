import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/auth/authThunk";
import { useNavigate } from "react-router-dom";

export default function ProfileCard() {
    const { user } = useSelector(state => state.auth)
    const dispatch=useDispatch();
    const navigate=useNavigate();

    const handleLogout=()=> {
      dispatch(logoutUser()).then(() => {
        
        navigate('/login', { replace: true })
      })
    }

    const  moveToProfilePage=() =>{
      console.log("navigated ")
      navigate('/profilePage');
    }

  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 2px)",
        right: 0,
        maxWidth: 280,
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: 12,
        boxShadow: "0 10px 30px rgba(0,0,0,.15)",
        padding: 16,
        zIndex: 1000,
      }}
    >
      <div
      onClick={moveToProfilePage}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "lightgrey",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <div style={{ fontWeight: 600 }}>{user?.name}</div>
          <div
            style={{
              fontSize: 13,
              color: "#777",
            }}
          >
            @{user?.username}
          </div>
        </div>
      </div>

      <hr style={{ margin: "16px 0" }} />

      <div style={{ fontSize: 14, marginBottom: 10 }}>
        {user?.email}
      </div>

      <div
        style={{
          fontSize: 13,
          color: user?.isVerified ? "green" : "red",
          marginBottom: 16,
        }}
      >
        {user?.isVerified ? "✓ Verified" : "✗ Not Verified"}
      </div>

      <button
      onClick={moveToProfilePage}
        style={{
          width: "100%",
          padding: 10,
          border: "none",
          background: "transparent",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        My Profile
      </button>

      {/* <button
        style={{
          width: "100%",
          padding: 10,
          border: "none",
          background: "transparent",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        Settings
      </button> */}

      <button
        onClick={handleLogout}
        style={{
          width: "100%",
          padding: 10,
          border: "none",
          background: "transparent",
          color: "red",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}