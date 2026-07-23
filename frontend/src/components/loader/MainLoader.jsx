import { TailSpin } from "react-loader-spinner";

export default function MainLoader({
  message = "Just wait a second...",
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        minHeight: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        padding: "2rem",
      }}
    >
      <TailSpin
        height={50}
        width={50}
        color="#F97316"
        ariaLabel="loading"
      />

      <span
        style={{
          fontSize: "1rem",
          color: "#4B5563",
          fontWeight: 500,
        }}
      >
        {message}
      </span>
    </div>
  );
}