import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./prePayment.module.css";

const PrePayment = () => {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleBack = () => {
    const result = window.Android.CancelPayment();
    navigate(-1); // برگشت به صفحه قبلی
  };

  const handlePayment = () => {
    let saveValue = Number(inputValue);
    console.log("پرداخت با مقدار:", saveValue);

    try {
      // Get the JSON string response from Android
      let jsonResponse = window.Android.DoPayment(saveValue);

      // Parse the JSON string to an object
      let response = JSON.parse(jsonResponse);

      // Now you can use the response object
      console.log("Payment Response:", response);
    } catch (error) {
      console.error("Error in payment process:", error);
      // Handle errors appropriately
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="مقدار را وارد کنید"
          className={styles.input}
        />

        <div className={styles.buttonContainer}>
          <button
            onClick={handleBack}
            className={`${styles.button} ${styles.backButton}`}
          >
            برگشت
          </button>

          <button
            onClick={handlePayment}
            className={`${styles.button} ${styles.payButton}`}
          >
            پرداخت
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrePayment;
