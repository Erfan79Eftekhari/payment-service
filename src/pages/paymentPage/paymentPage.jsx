import React from "react";

function PaymentPage() {
  const handlePayment = () => {
    try {
      window.Android.DoPayment(3000);
    } catch (error) {
      console.error("Error calling Android payment function:", error);
    }
  };
  const handleHello = () => {
    try {
      // window.Android.DoPayment(3000);
      window.Android.DoHello(3000);
    } catch (error) {
      console.error("Error calling Android Hello function:", error);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
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
  );
}

export default PaymentPage;
