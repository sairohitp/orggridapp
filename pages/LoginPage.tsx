
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { signInWithGoogle } from '../services/firebase';
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineCube } from 'react-icons/hi2';

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.021,35.591,44,30.134,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

const MicrosoftIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 21 21" aria-hidden="true">
        <path fill="#f25022" d="M1 1h9v9H1z" />
        <path fill="#00a4ef" d="M1 11h9v9H1z" />
        <path fill="#7fba00" d="M11 1h9v9h-9z" />
        <path fill="#ffb900" d="M11 11h9v9h-9z" />
    </svg>
);


export const LoginPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await signInWithGoogle();
        } catch (err: any) {
            if (err.code === 'auth/unauthorized-domain') {
                setError('This domain is not authorized. Please contact your administrator.');
            } else if (err.code === 'auth/popup-closed-by-user') {
                 setError('The sign-in popup was closed. Please try again.');
            } else {
                setError('An unexpected error occurred during sign-in.');
            }
            console.error("Error during Google sign-in:", err);
            setIsLoading(false);
        }
    };

    const inputStyle = "w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md mt-1 bg-white dark:bg-slate-800 text-sm shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none dark:disabled:bg-slate-800";
    const labelStyle = "text-sm font-semibold text-slate-700 dark:text-slate-300";
    
    return (
        <div className="h-screen w-screen bg-slate-50 dark:bg-slate-900 flex">
            {/* Left Panel */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-800">
                {/* Intentionally blank as per request */}
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto no-scrollbar">
                <div className="w-full max-w-sm">
                    <div className="text-center lg:text-left">
                         <h1 className="text-4xl font-black text-slate-800 dark:text-white lg:hidden mb-8">OrgGrid</h1>
                         <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in to your account</h2>
                         <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8">Welcome back! Please enter your details.</p>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label htmlFor="email" className={labelStyle}>E-mail</label>
                            <input id="email" type="email" placeholder="you@company.com" className={inputStyle} readOnly />
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className={labelStyle}>Password</label>
                            <input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className={`${inputStyle} pr-10`} readOnly />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                {showPassword ? <HiOutlineEyeSlash className="w-5 h-5"/> : <HiOutlineEye className="w-5 h-5"/>}
                            </button>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <a href="#" onClick={(e) => e.preventDefault()} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">Forgot password?</a>
                        </div>
                        <Button type="submit" variant="primary" className="w-full py-2.5" disabled>Sign in</Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-slate-300 dark:border-slate-600" /></div>
                        <div className="relative flex justify-center text-sm"><span className="bg-slate-50 dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">Or continue with</span></div>
                    </div>
                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 rounded-md text-sm text-red-700 dark:text-red-300 text-left">
                            <p className="font-semibold">Authentication Error</p>
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Button variant="secondary" className="w-full py-2.5" disabled>
                            <HiOutlineCube className="w-5 h-5 mr-3"/> Sign in with OTP
                        </Button>
                        <Button variant="secondary" className="w-full py-2.5" onClick={handleLogin} disabled={isLoading}>
                             {isLoading ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Signing in...
                                </>
                            ) : (
                                <>
                                   <GoogleIcon />
                                   Sign in with Google
                                </>
                            )}
                        </Button>
                         <Button variant="secondary" className="w-full py-2.5" disabled>
                            <MicrosoftIcon /> Sign in with Microsoft
                        </Button>
                    </div>

                    <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-600">
                        By continuing, you agree to OrgGrid's <a href="#" onClick={(e) => e.preventDefault()} className="font-medium text-slate-600 dark:text-slate-400 hover:underline">Terms of Service</a> and <a href="#" onClick={(e) => e.preventDefault()} className="font-medium text-slate-600 dark:text-slate-400 hover:underline">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};
