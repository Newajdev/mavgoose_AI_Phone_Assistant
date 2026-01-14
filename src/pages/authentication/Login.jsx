import { useContext } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import AuthContainer from "../../components/AuthContainer";
import InputField from "../../components/InputField";
import { Icon } from "@iconify/react";
import { AuthContext } from "../../provider/AuthContext";
import { loginApi } from "../../libs/auth.api";
import toast from "react-hot-toast";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

const onSubmit = async (data) => {
  const toastId = toast.loading("Signing in...");

  try {
    const res = await loginApi(data);

    // ✅ FIXED
    login(res.data.tokens ?? res.data);

    toast.success("Welcome back 👋", { id: toastId });
    navigate("/dashboard");
  } catch (error) {
    toast.dismiss(toastId);

    const message =
      error?.response?.data?.detail ||
      error?.response?.data?.non_field_errors?.[0] ||
      "Invalid email or password";

    setError("email", { type: "manual", message });
    setError("password", { type: "manual", message });

    toast.error(message);
  }
};


  return (
    <AuthContainer>
      <div className="flex flex-col items-center mb-8">
        <div className="size-12 bg-[#00D1FF20] rounded-xl flex items-center justify-center mb-4 border border-[#2B7FFF33]">
          <Icon icon="mdi:login" className="text-[#00D1FF]" width={28} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Sign in</h1>
        <p className="text-[#90A1B9] text-sm text-center">
          Sign in to manage your dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <InputField
          label="Email Address"
          icon="mdi:email-outline"
          placeholder="example@mail.com"
          name="email"
          register={register}
          error={errors.email}
          required="Email is required"
        />

        <div className="space-y-2">
          <InputField
            label="Password"
            icon="mdi:lock-outline"
            type="password"
            placeholder="••••••••"
            name="password"
            register={register}
            error={errors.password}
            required="Password is required"
          />
          <div className="flex justify-end">
            <NavLink
              to="/send-email"
              className="text-[#00D1FF] text-xs hover:underline"
            >
              Forgot Password?
            </NavLink>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-linear-to-r from-[#00D1FF] to-[#2B7FFF] text-white font-bold py-3.5 rounded-xl shadow-[0_4px_15px_#2B7FFF40] hover:shadow-[0_8px_25px_#2B7FFF60] transition-all transform active:scale-95"
        >
          Sign In
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-[#90A1B9] text-xs">
          Don't have an account?{" "}
          <NavLink
            to="/registration"
            className="text-[#00D1FF] font-medium hover:underline cursor-pointer"
          >
            Sign up
          </NavLink>
        </p>
      </div>
    </AuthContainer>
  );
}
