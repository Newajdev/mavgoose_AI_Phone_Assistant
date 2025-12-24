import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContainer from '../../components/AuthContainer';
import { Icon } from '@iconify/react';

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value !== '' && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    console.log("Verifying OTP:", otp.join(''));
    navigate('/change-password');
  };

  return (
    <AuthContainer>
      <div className="flex flex-col items-center mb-8">
        <div className="size-12 bg-[#00D1FF20] rounded-xl flex items-center justify-center mb-4 border border-[#2B7FFF33]">
          <Icon icon="mdi:shield-check-outline" className="text-[#00D1FF]" width={28} />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Check your email</h1>
        <p className="text-[#90A1B9] text-sm text-center">We sent a verification code to your email</p>
      </div>

      <div className="flex justify-between gap-2 md:gap-4 mb-8">
        {otp.map((data, index) => {
          return (
            <input
              className="w-10 h-10 md:w-12 md:h-12 bg-[#0F172B60] border-2 border-[#2B7FFF15] rounded-xl text-center text-white font-bold text-lg focus:border-[#2B7FFF] focus:outline-none transition-all"
              type="text"
              name="otp"
              maxLength="1"
              key={index}
              value={data}
              onChange={e => handleChange(e.target, index)}
              onFocus={e => e.target.select()}
              onKeyDown={e => handleKeyDown(e, index)}
              ref={el => inputs.current[index] = el}
            />
          );
        })}
      </div>

      <button
        onClick={handleVerify}
        className="w-full bg-linear-to-r from-[#00D1FF] to-[#2B7FFF] text-white font-bold py-3.5 rounded-xl shadow-[0_4px_15px_#2B7FFF40] transition-all mb-6"
      >
        Verify Code
      </button>

      <div className="text-center italic">
        <p className="text-xs text-[#90A1B9]">
          Didn't receive code?{' '}
          <span className="text-[#00D1FF] cursor-pointer hover:underline not-italic font-medium">Resend Code</span>
        </p>
      </div>
    </AuthContainer>
  );
}
