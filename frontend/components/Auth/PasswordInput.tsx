"use client";
import { Eye, EyeOff } from "lucide-react";
import React, { ChangeEvent, useState } from "react";

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  inputClassName?: string;
  labelClassName?: string;
  iconClassName?: string;
}

const PasswordInput = ({
  name,
  label,
  placeholder = "Enter Password",
  value,
  onChange,
  inputClassName = "",
  labelClassName = "",
  iconClassName = "",
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
      {label && (
        <label
          className={`font-semibold mb-2 block text-foreground ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`px-4 py-4 w-full bg-input rounded-lg text-foreground placeholder:text-muted-foreground block outline-none focus:ring-2 focus:ring-chart-8 ${inputClassName}`}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className={`absolute outline-none right-4 top-4 p-0 text-muted-foreground hover:text-foreground ${iconClassName}`}
        >
          {showPassword ? (
            <Eye className="h-5 w-5" />
          ) : (
            <EyeOff className="h-5 w-5" />
          )}
        </button>
      </div>
    </>
  );
};

export default PasswordInput;
