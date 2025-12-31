"use client";

import React from "react";
import SwitchDarkMode from "@/shared/SwitchDarkMode";

const ThemeToggleTopRight: React.FC = () => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <SwitchDarkMode />
    </div>
  );
};

export default ThemeToggleTopRight;
