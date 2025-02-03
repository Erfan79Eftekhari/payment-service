import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./prePayment.module.css";

const PrePayment = () => {
  const [inputValue, setInputValue] = useState("");
  const [cardData, setCardData] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleBack = () => {
    window.Android.CancelOperation();
    navigate(-1);
  };

  const handlePayment = async () => {
    let saveValue = Number(inputValue);
    console.log("پرداخت با مقدار:", saveValue);

    try {
      let jsonResponse = await window.Android.DoPayment(saveValue);
      let response = JSON.parse(jsonResponse);
      setCardData(response);
      console.log("Payment Response:", response);
    } catch (error) {
      console.error("Error in payment process:", error);
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
