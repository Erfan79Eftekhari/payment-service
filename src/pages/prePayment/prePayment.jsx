import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./prePayment.module.css";

const PrePayment = () => {
  const [inputValue, setInputValue] = useState("");
  const [cardData, setCardData] = useState(null);
  const navigate = useNavigate();

  // Attach onPaymentResult to the window immediately
  window.onPaymentResult = (result) => {
    try {
      // Convert JSON to JavaScript object
      const parsedResult = JSON.parse(result);

      // Debug log to confirm the function is being called
      console.log("Payment Result Received:", parsedResult);

      // Perform any necessary updates to the state
      setCardData(parsedResult);
    } catch (error) {
      console.error("Failed to parse payment result:", error);
    }
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Function to go back to the previous page
  const handleBack = async () => {
    window.Android.CancelOperation();
    // navigate(-1);
  };

  // Function to start the payment process
  const handlePayment = async () => {
    let saveValue = Number(inputValue);
    console.log("پرداخت با مقدار:", saveValue);

    try {
      // Call the payment method
      await window.Android.DoPayment(saveValue);
    } catch (error) {
      console.error("Error in payment process:", error);
    }
  };

  // Clean up the function when the component unmounts
  useEffect(() => {
    return () => {
      delete window.onPaymentResult;
    };
  }, []);

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

        {cardData && (
          <div className={styles.responseContainer}>
            <h3>اطلاعات تراکنش:</h3>
            <p>شماره کارت: {cardData.CardNumber}</p>
            <p>مبلغ: {cardData.Amount}</p>
            <p>شماره پیگیری: {cardData.TraceNumber}</p>
            <p>تاریخ و زمان: {cardData.DateAndTime}</p>
            <p>وضعیت: {cardData.ResponseFa}</p>
            {cardData.ResponseCode === 0 ? (
              <div className={styles.successMessage}>تراکنش موفق</div>
            ) : (
              <div className={styles.errorMessage}>تراکنش ناموفق</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrePayment;
