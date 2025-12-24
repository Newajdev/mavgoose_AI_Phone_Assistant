import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AuthContainer from '../../components/AuthContainer';
import InputField from '../../components/InputField';
import { Icon } from '@iconify/react';

export default function Changepassword() {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const password = watch("password");

  const onSubmit = (data) => {
    console.log("New password data:", data);
    setSuccess(true);
  };

  if (success) {
    return (
      <AuthContainer>
        <div className="flex flex-col items-center text-center py-4">
          <div className="size-20 bg-[#05DF7220] rounded-full flex items-center justify-center mb-8 border-2 border-[#05DF7233]">
            <Icon icon="mdi:check-circle" className="text-[#05DF72]" width={48} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Password Updated Successfully!</h1>
          <p className="text-[#90A1B9] text-sm mb-10 leading-relaxed">
            Your password has been changed successfully. You can now use your new password to sign in to your account.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-linear-to-r from-[#00D1FF] to-[#2B7FFF] text-white font-bold py-3.5 rounded-xl shadow-[0_4px_15px_#2B7FFF40] transition-all"
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
        <div className="size-12 bg-[#00D1FF20] rounded-xl flex items-center justify-center mb-4 border border-[#2B7FFF33]">
          <Icon icon="mdi:lock-open-check-outline" className="text-[#00D1FF]" width={28} />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Set new password</h1>
        <p className="text-[#90A1B9] text-sm text-center">Create a different password than your previous one</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <InputField
          label="New Password"
          icon="mdi:lock-outline"
          type="password"
          placeholder="••••••••"
          name="password"
          register={register}
          error={errors.password}
          required="Password is required"
        />

        <InputField
          label="Confirm Password"
          icon="mdi:lock-check-outline"
          type="password"
          placeholder="••••••••"
          name="confirmPassword"
          register={register}
          error={errors.confirmPassword}
          validate={(value) => value === password || "Passwords do not match"}
        />

        <button
          type="submit"
          className="w-full bg-linear-to-r from-[#00D1FF] to-[#2B7FFF] text-white font-bold py-3.5 rounded-xl shadow-[0_4px_15px_#2B7FFF40] transition-all"
        >
          Reset Password
        </button>
      </form>
    </AuthContainer>
  );
}
