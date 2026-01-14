import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContainer from "../../components/AuthContainer";
import { Icon } from "@iconify/react";
import { verifyOtpApi, resendOtpApi } from "../../libs/auth.api";
import toast from "react-hot-toast";

export default function VerifyOTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  /* 🔒 Guard: invalid session */
  useEffect(() => {
    if (!email) {
      toast.error("Invalid verification session");
      navigate("/send-email", { replace: true });
    }
  }, [email, navigate]);

  /* 🔢 Handle OTP input */
  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/g, "");
    if (!value) return;

    setOtp((prev) =>
      prev.map((d, idx) => (idx === index ? value : d))
    );

    if (index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      setOtp((prev) =>
        prev.map((d, idx) => (idx === index ? "" : d))
      );

      if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  /* ✅ Verify OTP */
  const handleVerify = async () => {
    if (loading) return;

    const code = otp.join("");

    if (code.length !== 6) {
      toast.error("Please enter 6-digit code");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Verifying code...");

    try {
      await verifyOtpApi({
        email,
        otp: code,
      });

      toast.success("OTP verified successfully ✅", { id: toastId });

      navigate("/change-password", {
        state: { email },
      });
    } catch (error) {
      toast.dismiss(toastId);

      const message =
        error?.response?.data?.non_field_errors?.[0] ||
        error?.response?.data?.detail ||
        "Invalid or expired OTP";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  /* 🔁 Resend OTP */
  const handleResend = async () => {
    if (loading) return;

    setLoading(true);
    const toastId = toast.loading("Resending code...");

    try {
      await resendOtpApi({ email });
      toast.success("New OTP sent 📩", { id: toastId });
    } catch (error) {
      toast.dismiss(toastId);

      const message =
        error?.response?.data?.detail ||
        "Please wait before requesting again";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <div className="flex flex-col items-center mb-8">
        <div className="size-12 bg-[#00D1FF20] rounded-xl flex items-center justify-center mb-4 border border-[#2B7FFF33]">
          <Icon
            icon="mdi:shield-check-outline"
            className="text-[#00D1FF]"
            width={28}
          />
        </div>

        <h1 className="text-xl font-bold text-white mb-2">
          Check your email
        </h1>
        <p className="text-[#90A1B9] text-sm text-center">
          We sent a verification code to your email
        </p>
      </div>

      {/* OTP INPUTS */}
      <div className="flex justify-between gap-2 md:gap-4 mb-8">
        {otp.map((value, index) => (
          <input
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            className="w-10 h-10 md:w-12 md:h-12 bg-[#0F172B60] border-2 border-[#2B7FFF15] rounded-xl text-center text-white font-bold text-lg focus:border-[#2B7FFF] focus:outline-none transition-all"
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={value}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-linear-to-r from-[#00D1FF] to-[#2B7FFF] text-white font-bold py-3.5 rounded-xl shadow-[0_4px_15px_#2B7FFF40] transition-all mb-6 disabled:opacity-60"
      >
        {loading ? "Verifying..." : "Verify Code"}
      </button>

      <div className="text-center italic">
        <p className="text-xs text-[#90A1B9]">
          Didn't receive code?{" "}
          <span
            onClick={handleResend}
            className="text-[#00D1FF] cursor-pointer hover:underline not-italic font-medium"
          >
            Resend Code
          </span>
        </p>
      </div>
    </AuthContainer>
  );
}
