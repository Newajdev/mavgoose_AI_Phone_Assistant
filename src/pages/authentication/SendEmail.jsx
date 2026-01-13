import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, NavLink } from "react-router-dom";
import AuthContainer from "../../components/AuthContainer";
import InputField from "../../components/InputField";
import { Icon } from "@iconify/react";
import { forgotPasswordApi } from "../../libs/auth.api";
import toast from "react-hot-toast";

export default function SendEmail() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const toastId = toast.loading("Sending reset code...");

    try {
      await forgotPasswordApi({ email: data.email });

      toast.success("OTP sent to your email 📩", { id: toastId });
      navigate("/verify-otp", {
        state: { email: data.email },
      });
    } catch (error) {
      toast.dismiss(toastId);

      const message =
        error?.response?.data?.email?.[0] ||
        error?.response?.data?.detail ||
        "Failed to send reset email";

      setError("email", {
        type: "manual",
        message,
      });

      toast.error(message);
    }
  };

  return (
    <AuthContainer>
      <div className="flex flex-col items-center mb-8">
        <div className="size-12 bg-[#00D1FF20] rounded-xl flex items-center justify-center mb-4 border border-[#2B7FFF33]">
          <Icon icon="mdi:lock-reset" className="text-[#00D1FF]" width={28} />
        </div>
        <h1 className="text-xl font-bold text-white mb-2 underline underline-offset-8 decoration-[#00D1FF]">
          Forgot Password
        </h1>
        <p className="text-[#90A1B9] text-sm text-center">
          Enter your email address to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <InputField
          label="Email Address"
          icon="mdi:email-outline"
          placeholder="example@mail.com"
          name="email"
          register={register}
          error={errors.email}
          required="Email is required"
        />

        <button
          type="submit"
          className="w-full bg-linear-to-r from-[#00D1FF] to-[#2B7FFF] text-white font-bold py-3.5 rounded-xl shadow-[0_4px_15px_#2B7FFF40] transition-all"
        >
          Send Reset Link
        </button>

        <div className="text-center">
          <NavLink
            to="/login"
            className="text-[#00D1FF] text-sm font-medium hover:underline flex items-center justify-center gap-2"
          >
            <Icon icon="mdi:arrow-left" /> Back to Login
          </NavLink>
        </div>
      </form>
    </AuthContainer>
  );
}
