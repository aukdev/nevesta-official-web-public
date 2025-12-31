"use client";

import Button, { ButtonProps } from "./Button";
import React from "react";

export interface ButtonSuccessProps extends ButtonProps {}

const ButtonSuccess: React.FC<ButtonSuccessProps> = ({
  className = " ",
  ...args
}) => {
  return (
    <Button
      className={`ttnc-ButtonPrimary disabled:bg-opacity-70 bg-green-600 hover:bg-green-700 text-neutral-50 ${className}`}
      {...args}
    />
  );
};

export default ButtonSuccess;
