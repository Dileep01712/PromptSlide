import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useNavigation } from '../Navigation/Navigate';
import { useGoogleLogin } from '@react-oauth/google';

const LoginPage: React.FC = () => {
    const { handleButtonClick } = useNavigation();

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            console.log(tokenResponse);
            // Handle login success here, such as sending the token to your backend.
        },
        onError: () => {
            console.log('Login failed');
        },
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Add logic to handle login submission
    };

    return (
        <div className="h-screen w-full mx-auto dark:bg-zinc-950 flex items-center justify-center">
            <div className="flex items-center justify-center mx-auto h-full w-full">
                <div className="mx-6">
                    <img src="../src/assets/UserAccess/login.webp" alt="Log In" className="h-[610px]" />
                </div>
                <div className="mx-6 p-8 w-5/12">
                    <form onSubmit={handleSubmit}>
                        <div className="pb-9">
                            <h1 className="text-2xl font-bold mx-auto">Log In</h1>
                        </div>

                        <div className="w-5/6">
                            <h3 className="mb-3">Login to your account</h3>
                            <p className="text-sm">Thank you for connecting with us at PromptSlide. We are pleased to provide you with our top recommendations.</p>
                        </div>
                        <div className="border-b my-5"></div>

                        <div className="mx-auto">
                            <label htmlFor="email" className="text-sm font-medium font-Lato">Email</label>
                            <input id="email" type="email" className="mt-2 block w-full p-2 dark:bg-zinc-700 border rounded focus:outline-none focus:ring-1 focus:ring-zinc-100 h-9" required />
                        </div>

                        <div className="mx-auto my-4">
                            <label htmlFor="password" className="text-sm font-medium font-Lato">Password</label>
                            <input id="password" type="password" className="mt-2 block w-full p-2 dark:bg-zinc-700 border rounded focus:outline-none focus:ring-1 focus:ring-zinc-100 h-9" required />
                        </div>

                        <div className="mx-auto flex items-center justify-between my-4">
                            <div className="flex items-center">
                                <input id="rememberMe" type="checkbox" className="mr-2 leading-tight" />
                                <label htmlFor="rememberMe" className="text-sm">Remember Me</label>
                            </div>
                            <Link to="/forgot-password" className="text-blue-500 text-sm">Forgot Password?</Link>
                        </div>

                        <div className="mx-auto">
                            <Button type="submit" className="w-full">Log In</Button>
                        </div>

                        <div className="my-7 relative flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                            <span className="px-4 bg-white dark:bg-zinc-950 text-gray-500 dark:text-white absolute left-1/2 transform -translate-x-1/2">
                                or
                            </span>
                        </div>

                        <div className="flex justify-center items-center mx-auto">
                            <Button onClick={() => login()} className="w-full">
                                <img src="../src/assets/UserAccess/google.svg" alt="Google Logo" className="h-6 mr-3" />
                                Log In with Google
                            </Button>
                        </div>

                        <div className="mx-auto mt-4">
                            <h2>Don't have an account? <Link to="/signup" className="text-blue-500" onClick={() => handleButtonClick('/signup')}>Sign Up</Link></h2>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
