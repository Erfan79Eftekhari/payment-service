import React, { useState } from "react";

function PaymentPage() {
  const [helloResult, setHelloResult] = useState(null);

  const handlePayment = () => {
    try {
      window.Android.DoPayment(3000);
    } catch (error) {
      console.error("Error calling Android payment function:", error);
    }
  };

  const handleHello = () => {
    try {
      const result = window.Android.DoHello(3000);
      console.log("Hello function result:", result);
      setHelloResult(result);
    } catch (error) {
      console.error("Error calling Android Hello function:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        gap: "20px",
      }}
    >
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handlePayment}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Make Payment
        </button>
        <button
          onClick={handleHello}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Say Hello
        </button>
      </div>

      {helloResult !== null && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: helloResult ? "#d4edda" : "#f8d7da",
            borderRadius: "4px",
            color: helloResult ? "#155724" : "#721c24",
          }}
        >
          {helloResult ? "The result is True!" : "The result is False!"}
        </div>
      )}
    </div>
  );
}

export default PaymentPage;
