import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import styles from "./print.module.css";

const Print = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [printMessage, setPrintMessage] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);

  // اطلاعات رو از location.state دریافت می‌کنیم
  const cardData = location.state?.cardData || {
    DateAndTime: "",
    TraceNumber: "",
    CardNumber: "",
    Amount: "",
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    setPrintMessage("");

    try {
      let buyersReceipt = document.querySelector(`.${styles.buyersReceipt}`);
      buyersReceipt.classList.remove(styles.displaynone);

      const buyerCanvas = await html2canvas(buyersReceipt, { scale: 2 });
      const buyerBase64Image = buyerCanvas.toDataURL("image/png").split(",")[1];

      const buyerResult = await window.Android.SaveReceiptWithVerification(
        buyerBase64Image
      );
      const buyerResponse = JSON.parse(buyerResult);

      if (!buyerResponse.isPrinted) {
        setPrintMessage(buyerResponse.Message || "خطا در چاپ نسخه خریدار");
        buyersReceipt.classList.add(styles.displaynone);
        setIsPrinting(false);
        return;
      }

      buyersReceipt.classList.add(styles.displaynone);
      let sellersReceipt = document.querySelector(`.${styles.sellersReceipt}`);
      sellersReceipt.classList.remove(styles.displaynone);

      const sellerCanvas = await html2canvas(sellersReceipt, { scale: 2 });
      const sellerBase64Image = sellerCanvas
        .toDataURL("image/png")
        .split(",")[1];

      const sellerResult = await window.Android.SaveReceiptWithVerification(
        sellerBase64Image
      );
      const sellerResponse = JSON.parse(sellerResult);

      sellersReceipt.classList.add(styles.displaynone);

      if (sellerResponse.isPrinted) {
        setPrintMessage("چاپ هر دو نسخه با موفقیت انجام شد");
      } else {
        setPrintMessage(sellerResponse.Message || "خطا در چاپ نسخه فروشنده");
      }
    } catch (error) {
      console.error("Error during printing:", error);
      setPrintMessage("خطا در فرآیند چاپ");
    } finally {
      setIsPrinting(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <button
          onClick={handleBack}
          className={styles.backButton}
          disabled={isPrinting}
        >
          بازگشت به صفحه اصلی
        </button>
        <button
          onClick={handlePrint}
          className={styles.printButton}
          disabled={isPrinting}
        >
          {isPrinting ? "در حال چاپ..." : "پرینت"}
        </button>
      </div>

      {printMessage && (
        <div
          className={`${styles.message} ${
            printMessage.includes("موفقیت") ? styles.success : styles.error
          }`}
        >
          {printMessage}
        </div>
      )}

      <div className={`${styles.buyersReceipt} ${styles.displaynone}`}>
        <h2>نسخه خریدار</h2>
        <h1>رسید پرداخت</h1>
        <div className={styles.details}>
          <div className={styles.left}>
            <p>{cardData.DateAndTime}</p>
          </div>
          <div className={styles.right}>
            <p>شماره پیگیری: {cardData.TraceNumber}</p>
            <p>شماره کارت: {cardData.CardNumber}</p>
          </div>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>شرح</th>
              <th>مبلغ (ریال)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>پرداخت</td>
              <td>{cardData.Amount}</td>
            </tr>
          </tbody>
        </table>
        <div className={styles.total}>
          <p>جمع کل</p>
          <p>{cardData.Amount} ریال</p>
        </div>
        <p className={styles.footer}>با تشکر از پرداخت شما</p>
      </div>

      <div className={`${styles.sellersReceipt} ${styles.displaynone}`}>
        {/* محتوای مشابه با نسخه خریدار */}
        <h2>نسخه فروشنده</h2>
        {/* ... بقیه محتوا مشابه نسخه خریدار ... */}
      </div>
    </div>
  );
};

export default Print;
