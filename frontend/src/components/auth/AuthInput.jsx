import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function AuthInput({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  autoFocus,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        width: "100%",
      }}
    >
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "var(--color-on-surface)",
          }}
        >
          {label}
        </label>
      )}

      <div
        style={{
          position: "relative",
          width: "100%",
        }}
      >
        <input
          id={id}
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoFocus={autoFocus}
          style={{
            width: "100%",
            height: "40px",
            padding: isPassword ? "0 40px 0 12px" : "0 12px",
            border: "1px solid",
            borderColor: error
              ? "var(--color-error)"
              : "var(--color-outline)",
            borderRadius: "4px",
            fontSize: "14px",
            color: "var(--color-on-surface)",
            outline: "none",
            background: "var(--color-surface-container-lowest)",
            boxSizing: "border-box",
          }}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: "#666",
            }}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <p
          style={{
            fontSize: "12px",
            color: "var(--color-error)",
            margin: 0,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}