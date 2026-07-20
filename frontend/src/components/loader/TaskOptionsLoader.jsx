import { TailSpin } from "react-loader-spinner";

export default function TaskOptionsLoader() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "420px", // adjust to match your modal content height
        display: "flex",
        flexDirection:"column",
        justifyContent: "center",
        alignItems: "center",
        gap:"1rem"
      }}
    >
      <TailSpin
        height={50}
        width={50}
        color="#F97316"
        ariaLabel="loading"
      />
      <span>just wait for a moment ..</span>

    </div>
  );
}