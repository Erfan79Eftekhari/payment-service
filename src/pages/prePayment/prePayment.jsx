import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./prePayment.module.css"; // مطمئن شوید که این فایل CSS را شامل می‌شود.

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
    <div className="container">
      <div className="formContainer">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="مقدار را وارد کنید"
          className="input"
        />
        <div className="buttonContainer">
          <button onClick={handleBack} className="button backButton">
            برگشت
          </button>
          <button onClick={handlePayment} className="button payButton">
            پرداخت
          </button>
          <button onClick={handleScan} className="button scanButton">
            اسکن بارکد
          </button>
        </div>

        {/* نمایش نتیجه اسکن */}
        {scanOccurred && (
          <div className="scanResultContainer">
            <h3>نتیجه اسکن:</h3>
            <p>{scanResult !== "" ? scanResult : "چیزی اسکن نشد"}</p>
          </div>
        )}

        {/* نمایش اطلاعات تراکنش */}
        {cardData && (
          <div className="responseContainer">
            <h3>اطلاعات تراکنش:</h3>
            <p>شماره کارت: {cardData.CardNumber}</p>
            <p>مبلغ: {cardData.Amount}</p>
            <p>شماره پیگیری: {cardData.TraceNumber}</p>
            <p>تاریخ و زمان: {cardData.DateAndTime}</p>
            <p>وضعیت: {cardData.ResponseFa}</p>
            {cardData.ResponseCode === 0 || cardData.ResponseCode === 100 ? (
              <>
                <div className="successMessage">تراکنش موفق</div>
                <button
                  onClick={handleNavigateToPrint}
                  className="button printButton"
                >
                  چاپ رسید
                </button>
              </>
            ) : (
              <div className="errorMessage">تراکنش ناموفق</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrePayment;
