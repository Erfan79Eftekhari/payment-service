import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button/button.jsx";
import styles from "./notfound.module.css";
import errorimage from "../../assets/images/404.jpg";

export default function Notfound() {
  const navigate = useNavigate();
  return (
    <div className={styles["container"]}>
      <div className={styles["pagecontainer"]}>
        <div className={styles["imagecontainer"]}>
          <img
            alt="Error404"
            className={styles["image404"]}
            src={errorimage}
          ></img>
        </div>
        <div className={styles["message"]}>
          <h3>{"متأسفیم.صفحه مورد نظر شما یا جستجوی شما یافت نشد."}</h3>
        </div>
        <Button
          text={"بازگشت به صفحه اصلی"}
          size="large"
          variant="primary"
          onClick={() => navigate("/payment")}
          customStyles={{
            width: "80rem",
            height: "5.6rem",
            marginBottom: "2.4rem",
          }}
        ></Button>
      </div>
    </div>
  );
}
