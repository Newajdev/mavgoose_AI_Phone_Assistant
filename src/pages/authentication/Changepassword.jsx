import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContainer from "../../components/AuthContainer";
import InputField from "../../components/InputField";
import { Icon } from "@iconify/react";
import { resetPasswordApi } from "../../libs/auth.api";
import toast from "react-hot-toast";

export default function Changepassword() {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ email must come from OTP verification step
  const email = location.state?.email;

  const password = watch("password");

  const onSubmit = async (data) => {
    // 🔒 Safety check (OTP session expired / reload case)
    if (!email) {
      toast.error("Reset session expired. Please verify OTP again.");
      navigate("/send-email");
      return;
    }

    const toastId = toast.loading("Updating password...");

    try {
      // ✅ EXACT payload Django expects
      await resetPasswordApi({
        email: email,
        new_password: data.password,
        confirm_password: data.confirmPassword,
      });

      toast.success("Password updated successfully 🎉", { id: toastId });
      setSuccess(true);
    } catch (error) {
      toast.dismiss(toastId);

      const resErrors = error?.response?.data;

      if (resErrors) {
        if (typeof resErrors === "string") {
          toast.error(resErrors);
        } else {
          Object.keys(resErrors).forEach((field) => {
            const message = Array.isArray(resErrors[field])
              ? resErrors[field][0]
              : resErrors[field];

            setError(field, {
              type: "manual",
              message,
            });
          });
          toast.error("Failed to reset password");
        }
      } else {
        toast.error("Something went wrong. Try again.");
      }
    }
  };

  // ✅ Success screen
  if (success) {
    return (
      <AuthContainer>
        <div className="flex flex-col items-center text-center py-4">
          <div className="size-20 bg-[#05DF7220] rounded-full flex items-center justify-center mb-8 border-2 border-[#05DF7233]">
            <Icon icon="mdi:check-circle" className="text-[#05DF72]" width={48} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Password Updated Successfully!
          </h1>
          <p className="text-[#90A1B9] text-sm mb-10 leading-relaxed">
            Your password has been changed successfully. You can now sign in
            using your new password.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-linear-to-r from-[#00D1FF] to-[#2B7FFF] text-white font-bold py-3.5 rounded-xl"
          >
            Sign In
          </button>
        </div>
      </AuthContainer>
    );
  }

  return (
    <AuthContainer>
      <div className="flex flex-col items-center mb-8">
        <div className="size-12 bg-[#00D1FF20] rounded-xl flex items-center justify-center mb-4">
          <Icon
            icon="mdi:lock-open-check-outline"
            className="text-[#00D1FF]"
            width={28}
          />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">
          Set new password
        </h1>
        <p className="text-[#90A1B9] text-sm text-center">
          Create a different password than your previous one
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 🔒 Email shown but NOT editable */}
        <InputField
          label="Email"
          icon="mdi:email-outline"
          type="email"
          value={email || ""}
          disabled
        />

        <InputField
          label="New Password"
          icon="mdi:lock-outline"
          type="password"
          placeholder="Enter new password"
          name="password"
          register={register}
          rules={{ required: "Password is required", minLength: 8 }}
          error={errors.password}
        />

        <InputField
          label="Confirm Password"
          icon="mdi:lock-check-outline"
          type="password"
          placeholder="Enter confirm password"
          name="confirmPassword"
          register={register}
          rules={{
            validate: (value) =>
              value === password || "Passwords do not match",
          }}
          error={errors.confirmPassword}
        />

        <button
          type="submit"
          className="w-full bg-linear-to-r from-[#00D1FF] to-[#2B7FFF] text-white font-bold py-3.5 rounded-xl"
        >
          Reset Password
        </button>
      </form>
    </AuthContainer>
  );
}
