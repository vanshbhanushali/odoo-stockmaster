
import React, { useState } from 'react';
import { Mail, Lock, User, Key, Loader2, ArrowLeft } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

type AuthView = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD' | 'OTP' | 'RESET_PASSWORD';

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpContext, setOtpContext] = useState<'LOGIN' | 'RESET'>('LOGIN');

  const simulateApi = (callback: () => void) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      callback();
    }, 800); // Slightly faster for better UX
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    simulateApi(() => {
      setOtpContext('LOGIN');
      // In a real app, this would send an email. For demo, we just proceed.
      // alert(`OTP sent to ${email} (Use 1234)`); 
      setView('OTP');
    });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    simulateApi(() => onLogin());
  };

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    simulateApi(() => {
      setOtpContext('RESET');
      setView('OTP');
    });
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    simulateApi(() => {
      if (otp.trim() === '1234') {
        if (otpContext === 'LOGIN') {
          onLogin();
        } else {
          setView('RESET_PASSWORD');
        }
      } else {
        alert('Invalid OTP. Please try again. (Use 1234)');
      }
    });
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    simulateApi(() => {
      alert('Password has been reset successfully.');
      setView('LOGIN');
    });
  };

  const handleBackFromOtp = () => {
    setOtp(''); // Clear OTP input
    if (otpContext === 'LOGIN') {
      setView('LOGIN');
    } else {
      setView('FORGOT_PASSWORD');
    }
  };

  const InputField = ({ icon: Icon, type, placeholder, value, onChange, required = true }: any) => (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type={type}
        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-odoo-500 focus:border-transparent outline-none transition-all"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans">
      <div className="mb-8 text-center animate-fade-in">
        <div className="w-16 h-16 bg-odoo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
           <span className="text-2xl font-bold text-white">SM</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">StockMaster</h1>
        <p className="text-slate-500">Smart Inventory Management</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 animate-scale-in transition-all">
        {view === 'LOGIN' && (
          <form onSubmit={handleLogin}>
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Welcome Back</h2>
            <InputField icon={Mail} type="email" placeholder="Email Address" value={email} onChange={setEmail} />
            <InputField icon={Lock} type="password" placeholder="Password" value={password} onChange={setPassword} />
            
            <div className="flex justify-end mb-6">
              <button type="button" onClick={() => setView('FORGOT_PASSWORD')} className="text-sm text-odoo-600 hover:underline font-medium">
                Forgot Password?
              </button>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-odoo-600 hover:bg-odoo-700 text-white py-2.5 rounded-lg font-semibold shadow-md transition-colors flex justify-center items-center"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
            </button>

            <div className="mt-6 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <button type="button" onClick={() => setView('SIGNUP')} className="text-odoo-600 font-semibold hover:underline">
                Sign Up
              </button>
            </div>
          </form>
        )}

        {view === 'SIGNUP' && (
          <form onSubmit={handleSignup}>
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Create Account</h2>
            <InputField icon={User} type="text" placeholder="Full Name" value={name} onChange={setName} />
            <InputField icon={Mail} type="email" placeholder="Email Address" value={email} onChange={setEmail} />
            <InputField icon={Lock} type="password" placeholder="Create Password" value={password} onChange={setPassword} />

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-odoo-600 hover:bg-odoo-700 text-white py-2.5 rounded-lg font-semibold shadow-md transition-colors flex justify-center items-center mt-6"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign Up'}
            </button>

            <div className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <button type="button" onClick={() => setView('LOGIN')} className="text-odoo-600 font-semibold hover:underline">
                Login
              </button>
            </div>
          </form>
        )}

        {view === 'FORGOT_PASSWORD' && (
          <form onSubmit={handleSendOTP}>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Reset Password</h2>
            <p className="text-sm text-slate-500 mb-6">Enter your email to receive an OTP.</p>
            <InputField icon={Mail} type="email" placeholder="Email Address" value={email} onChange={setEmail} />

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-odoo-600 hover:bg-odoo-700 text-white py-2.5 rounded-lg font-semibold shadow-md transition-colors flex justify-center items-center"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTP'}
            </button>

            <div className="mt-6 text-center">
              <button type="button" onClick={() => setView('LOGIN')} className="text-sm text-slate-400 hover:text-slate-600">
                Back to Login
              </button>
            </div>
          </form>
        )}

        {view === 'OTP' && (
          <form onSubmit={handleVerifyOTP}>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Enter OTP</h2>
            <p className="text-sm text-slate-500 mb-6">
              We sent a code to <span className="font-medium text-slate-800">{email || 'your email'}</span>
            </p>
            
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded text-xs mb-4 border border-blue-100">
              Demo Mode: Use code <strong>1234</strong>
            </div>

            <InputField icon={Key} type="text" placeholder="Enter 4-digit Code" value={otp} onChange={setOtp} />

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-odoo-600 hover:bg-odoo-700 text-white py-2.5 rounded-lg font-semibold shadow-md transition-colors flex justify-center items-center"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify'}
            </button>

            <div className="mt-6 text-center">
              <button type="button" onClick={handleBackFromOtp} className="text-sm text-slate-400 hover:text-slate-600 flex items-center justify-center gap-2 mx-auto group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
              </button>
            </div>
          </form>
        )}

        {view === 'RESET_PASSWORD' && (
          <form onSubmit={handleResetPassword}>
            <h2 className="text-xl font-semibold text-slate-800 mb-6">New Password</h2>
            <InputField icon={Lock} type="password" placeholder="New Password" value={newPassword} onChange={setNewPassword} />
            <InputField icon={Lock} type="password" placeholder="Confirm Password" value={password} onChange={setPassword} />

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold shadow-md transition-colors flex justify-center items-center"
            >
               {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
