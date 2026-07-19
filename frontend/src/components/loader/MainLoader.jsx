// components/Loader.jsx

import { TailSpin } from "react-loader-spinner";

export default function MainLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
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
      <span>Just wait for sec ...</span>
    </div>
  );
}