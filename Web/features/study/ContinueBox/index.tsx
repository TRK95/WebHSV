import classNames from "classnames";
import { PropsWithoutRef, MouseEventHandler, useState, useEffect } from "react";
import "./continueBox.scss";

const ContinueBox = (props: PropsWithoutRef<{
  value: number;
  label: string;
  color: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
}>) => {
  const { value, label, color, onClick, disabled } = props;

  return <div className={classNames(
    "continue-box-button",
    disabled ? "disabled" : ""
  )} onClick={onClick}>
    <div className="continue-box-value" style={{ color }}>{value}</div>
    <div className="continue-box-main">
      <div className="continue-box-main-button" style={{ background: color }}>Continue</div>
      <div className="continue-box-label">{label}</div>
    </div>
  </div>
}

export default ContinueBox;