import React, { useCallback, useState } from "react";
import { TextInput } from "@pokt-foundation/ui";
import IconEye from "../../icons/iconEye";

export default function PasswordInput({ placeholder, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prevShow) => !prevShow);
  }, []);

  return (
    <TextInput
      adornment={
        <IconEye
          color="white"
          onClick={togglePasswordVisibility}
          type={showPassword ? "closed" : ""}
        />
      }
      adornmentPosition="end"
      type={showPassword ? "text" : "password"}
      placeholder={placeholder}
      wide
      {...props}
    />
  );
}
