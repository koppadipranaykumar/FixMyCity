import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordForm = () => {
  const [step, setStep] = useState(1); // Step 1: send OTP, Step 2: verify OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const sendOTP = async () => {
    try {
      await axios.post('/api/auth/send-otp', { email });
      alert('OTP sent to your email!');
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error sending OTP');
    }
  };

  const verifyOTPAndReset = async () => {
    try {
      await axios.post('/api/auth/verify-otp', {
        email,
        otp,
        newPassword
      });
      alert('Password reset successful. You can now log in.');
      window.location.reload(); // Optional: go back to login
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to reset password');
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button onClick={sendOTP}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button onClick={verifyOTPAndReset}>Reset Password</button>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
