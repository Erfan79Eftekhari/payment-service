import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./prePayment.module.css";

const PrePayment = () => {
  const [inputValue, setInputValue] = useState("");
  const [cardData, setCardData] = useState(null);
  const navigate = useNavigate();

  // تابع برای مدیریت تغییرات ورودی
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // تابع برای برگشت به صفحه قبلی
  const handleBack = async () => {
    window.Android.CancelOperation();
    navigate(-1);
  };

  // تابع برای شروع پرداخت
  const handlePayment = async () => {
    let saveValue = Number(inputValue);
    console.log("پرداخت با مقدار:", saveValue);

    try {
      // فراخوانی متد پرداخت
      await window.Android.DoPayment(saveValue);
    } catch (error) {
      console.error("Error in payment process:", error);
    }
  };

  // تابع برای هندل کردن نتیجه پرداخت (این تابع توسط WebView فراخوانی می‌شود)
  const onPaymentResult = (result) => {
    try {
      // تبدیل JSON به شیء جاوااسکریپت
      const parsedResult = JSON.parse(result);

      // ذخیره اطلاعات پرداخت در state
      setCardData(parsedResult);

      console.log("Payment Result:", parsedResult);
    } catch (error) {
      console.error("Failed to parse payment result:", error);
    }
  };

  // اضافه کردن تابع onPaymentResult به window برای دسترسی WebView
  useEffect(() => {
    window.onPaymentResult = onPaymentResult;

    // پاکسازی تابع از window هنگام خروج از کامپوننت
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
