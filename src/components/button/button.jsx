import React from "react";
import PropTypes from "prop-types";
import styles from "./button.module.css"; // استفاده از CSS Modules

const Button = ({
  text,
  variant = "primary",
  color = "orange",
  size = "medium",
  icon = null,
  disabled = false,
  onClick,
  customStyles = {}, // دریافت استایل‌های دلخواه از props
}) => {
  // تولید کلاس‌های دکمه بر اساس ویژگی‌های مختلف
  const classes = `
    ${styles.button}
    ${styles[`button--${variant}`]}
    ${styles[`button--${color}`]}
    ${styles[`button--${size}`]}
    ${disabled ? styles["button--disabled"] : ""}
    ${
      styles[
        `button--elevation-${variant}-${size}-${
          disabled ? "disabled" : "normal"
        }`
      ]
    }
  `;

  return (
    <button
      className={classes}
      disabled={disabled}
      onClick={onClick}
      style={customStyles} // اعمال استایل‌های دلخواه به صورت inline
    >
      {icon && <span className={styles["button__icon"]}>{icon}</span>}{" "}
      {/* نمایش آیکون */}
      {text && <span className={styles["button__text"]}>{text}</span>}{" "}
      {/* نمایش متن */}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string,
  variant: PropTypes.oneOf(["primary", "secondary", "outline"]),
  color: PropTypes.oneOf(["orange", "blue", "gray"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  icon: PropTypes.node,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  customStyles: PropTypes.object, // تعریف prop برای استایل‌های دلخواه
};

export default Button;
