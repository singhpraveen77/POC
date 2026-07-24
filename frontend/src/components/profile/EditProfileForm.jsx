import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Input from "../common/Input";
import Button from "../common/Button";

import ProfileAvatar from "./ProfileAvatar";
import ProfileInfoCard from "./ProfileInfoCard";

import { updateProfile } from "../../redux/profile/profileThunk";
import { updateProfileSchema } from "../../validators/profileValidation";

export default function EditProfileForm({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.profile);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user]);

const handleChange = (e) => {
  setErrors((prev) => ({
    ...prev,
    [e.target.name]: "",
  }));

  setFormData((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};



const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("handle edit page is called !!")

  const result = updateProfileSchema.safeParse(formData);

  if (!result.success) {
    const formattedErrors = {};

    result.error.issues.forEach((err) => {
      formattedErrors[err.path[0]] = err.message;
    });

    setErrors(formattedErrors);
    return;
  }

  setErrors({});

  try {
    await dispatch(updateProfile(result.data)).unwrap();

    navigate("/profilePage");
  } catch (error) {
    console.error(error);
  }
};

  return (
    <ProfileInfoCard
      title="Edit Profile"
      subtitle="Update your personal information."
    >
      <ProfileAvatar name={formData.name} />

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginTop: "24px",
        }}
      >
        <Input
          id="name"
          name="name"
          label="Full Name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />

        <Input
          id="username"
          name="username"
          label="Username"
          placeholder="Enter username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
        />

        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "12px",
          }}
        >
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate("/profilePage")}
          >
            Cancel
          </Button>

          <Button
            variant="solid"
            type="submit"
            loading={loading}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </ProfileInfoCard>
  );
}