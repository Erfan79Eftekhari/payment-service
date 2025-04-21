import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./prePayment.module.css";

const PrePayment = () => {
  const [inputValue, setInputValue] = useState("");
  const [cardData, setCardData] = useState(null);
  const navigate = useNavigate();

  window.onPaymentResult = (result) => {
    try {
      const parsedResult = JSON.parse(result);
      console.log("Payment Result Received:", parsedResult);
      setCardData(parsedResult);
    } catch (error) {
      console.error("Failed to parse payment result:", error);
    }
  };
  window.OnRequestAck = () => {
    setTimeout(() => {
      if (
        window.Android &&
        typeof window.Android.onRecieveAckNak === "function"
      ) {
        console.log("i send Nak");
        window.Android.onRecieveAckNak(false);
      } else {
        console.warn(
          "Android interface or onRecieveAckNak method not available"
        );
      }
    }, 2000); // simulate async work
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleBack = async () => {
    window.Android.CancelOperation();
    // navigate(-1);
  };

  const handlePayment = async () => {
    let saveValue = Number(inputValue);
    console.log("پرداخت با مقدار:", saveValue);

    try {
      await window.Android.DoPayment(saveValue);
    } catch (error) {
      console.error("Error in payment process:", error);
    }
  };

  // اضافه کردن تابع برای هدایت به صفحه پرینت
  const handleNavigateToPrint = () => {
    navigate("/print", { state: { cardData } }); // انتقال اطلاعات تراکنش به صفحه پرینت
  };

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
            {cardData.ResponseCode === 0 || cardData.ResponseCode === 100 ? (
              <>
                <div className={styles.successMessage}>تراکنش موفق</div>
                <button
                  onClick={handleNavigateToPrint}
                  className={`${styles.button} ${styles.printButton}`}
                >
                  چاپ رسید
                </button>
              </>
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
