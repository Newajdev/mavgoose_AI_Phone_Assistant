import React from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthContainer from '../../components/AuthContainer';
import InputField from '../../components/InputField';
import { Icon } from '@iconify/react';

export default function Registration() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log("Registration data:", data);
    navigate('/login');
  };

  return (
    <AuthContainer>
      <div className="flex flex-col items-center mb-6">
        <div className="size-10 bg-[#00D1FF20] rounded-lg flex items-center justify-center mb-3 border border-[#2B7FFF33]">
          <Icon icon="mdi:account-plus" className="text-[#00D1FF]" width={24} />
        </div>
        <h1 className="text-xl font-bold text-white mb-1">Sign up</h1>
        <p className="text-[#90A1B9] text-xs text-center font-medium">Create your account to manage your dashboard</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="First Name"
            icon="mdi:account-outline"
            placeholder="John"
            name="firstName"
            register={register}
            error={errors.firstName}
            required="Required"
          />
          <InputField
            label="Last Name"
            icon="mdi:account-outline"
            placeholder="Doe"
            name="lastName"
            register={register}
            error={errors.lastName}
            required="Required"
          />
        </div>

        <InputField
          label="Email Address"
          icon="mdi:email-outline"
          placeholder="example@mail.com"
          name="email"
          register={register}
          error={errors.email}
          required="Email is required"
        />

        <InputField
          label="State / Location"
          icon="mdi:map-marker-outline"
          placeholder="New York, USA"
          name="location"
          register={register}
          error={errors.location}
          required="Location is required"
        />

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

        <div className="flex items-start gap-2 pt-2">
          <input
            id="terms"
            type="checkbox"
            className="mt-1 size-4 bg-[#0F172B60] border-[#2B7FFF33] rounded focus:ring-0 text-[#2B7FFF]"
            {...register("terms", { required: true })}
          />
          <label htmlFor="terms" className="text-xs text-[#90A1B9] leading-tight">
            I agree to the <span className="text-[#00D1FF] cursor-pointer hover:underline">Terms of Service</span> and <span className="text-[#00D1FF] cursor-pointer hover:underline">Privacy Policy</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-linear-to-r from-[#00D1FF] to-[#2B7FFF] text-white font-bold py-3 rounded-xl shadow-[0_4px_15px_#2B7FFF40] hover:shadow-[0_8px_25px_#2B7FFF60] transition-all transform active:scale-95 mt-2"
        >
          Sign Up
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-[#90A1B9] text-xs">
          Already have an account?{' '}
          <NavLink to="/login" className="text-[#00D1FF] font-medium hover:underline">
            Sign in
          </NavLink>
        </p>
      </div>
    </AuthContainer>
  );
}
