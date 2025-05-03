import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./prePayment.module.css"; // دقت کن این ایمپورت باید باشه

const PrePayment = () => {
  const [inputValue, setInputValue] = useState("");
  const [cardData, setCardData] = useState(null);
  const [scanResult, setScanResult] = useState("");
  const [scanOccurred, setScanOccurred] = useState(false);
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

  window.onScanResult = (success, barcode) => {
    try {
      if (success) {
        console.log("Barcode Received:", barcode);
        setScanResult(barcode || "");
      } else {
        console.log("Something went wrong: ", barcode);
        setScanResult("");
      }
      setScanOccurred(true);
    } catch (error) {
      console.error("Failed to get scan result", error);
      setScanResult("");
      setScanOccurred(true);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handlePayment = async () => {
    const amount = Number(inputValue);
    console.log("پرداخت با مقدار:", amount);
    try {
      await window.Android.DoPayment(amount);
    } catch (error) {
      console.error("Error in payment process:", error);
    }
  };

  const handleScan = async () => {
    setScanResult("");
    setScanOccurred(false);
    try {
      if (window.Android && typeof window.Android.DoScanHID === "function") {
        await window.Android.DoScanHID(5000);
      } else {
        console.warn("Android interface or DoScanHID method not available");
      }
    } catch (error) {
      console.error("Error in scan process:", error);
    }
  };

  const handleBack = async () => {
    window.Android.CancelOperation();
  };

  const handleNavigateToPrint = () => {
    navigate("/print", { state: { cardData } });
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
          <button
            onClick={handleScan}
            className={`${styles.button} ${styles.scanButton}`}
          >
            اسکن بارکد
          </button>
        </div>

        {/* نمایش نتیجه اسکن */}
        {scanOccurred && (
          <div className={styles.scanResultContainer}>
            <h3>نتیجه اسکن:</h3>
            <p>{scanResult !== "" ? scanResult : "چیزی اسکن نشد"}</p>
          </div>
        )}

        {/* نمایش اطلاعات تراکنش */}
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
