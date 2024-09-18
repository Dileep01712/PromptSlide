import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useNavigation } from '../Navigation/Navigate';
import { useGoogleLogin } from '@react-oauth/google';

const RegisterPage: React.FC = () => {
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
        // Add logic to handle form data submission
    };

    return (
        <div className="h-screen w-full mx-auto dark:bg-zinc-950 flex items-center justify-center">
            <div className="flex items-center justify-center mx-auto h-fit w-full">
                <div className="mx-5">
                    <img src="../src/assets/UserAccess/register.webp" alt="Register" className="h-[641px]" />
                </div>
                <div className="mx-5 p-8">
                    <form onSubmit={handleSubmit}>
                        <div className="pb-9">
                            <h1 className="text-2xl font-bold mx-auto">Sign Up</h1>
                        </div>

                        <div className="w-5/6">
                            <h3 className="mb-3">Manage all your Presentations efficiently</h3>
                            <p className="text-sm">Let's get you all set up so you can verify your personal account and begin setting up your profile.</p>
                        </div>
                        <div className="border-b my-5"></div>

                        <div className="flex items-center justify-center">
                            <div className="w-1/2 mr-2">
                                <label htmlFor="firstName" className="text-sm font-medium font-Lato">First Name</label>
                                <input id="firstName" type="text" className="mt-2 block w-full p-2 dark:bg-zinc-700 border rounded focus:outline-none focus:ring-1 focus:ring-zinc-100 h-9" required />
                            </div>
                            <div className="w-1/2 ml-2">
                                <label htmlFor="lastName" className="text-sm font-medium font-Lato">Last Name</label>
                                <input id="lastName" type="text" className="mt-2 block w-full p-2 dark:bg-zinc-700 border rounded focus:outline-none focus:ring-1 focus:ring-zinc-100 h-9" />
                            </div>
                        </div>

                        <div className="flex items-center justify-center my-4">
                            <div className="w-1/2 mr-2">
                                <label htmlFor="phone" className="text-sm font-medium font-Lato">Phone Number</label>
                                <input id="phone" type="tel" className="mt-2 block w-full p-2 dark:bg-zinc-700 border rounded focus:outline-none focus:ring-1 focus:ring-zinc-100 h-9" />
                            </div>
                            <div className="w-1/2 ml-2">
                                <label htmlFor="email" className="text-sm font-medium font-Lato">Email</label>
                                <input id="email" type="email" className="mt-2 block w-full p-2 dark:bg-zinc-700 border rounded focus:outline-none focus:ring-1 focus:ring-zinc-100 h-9" />
                            </div>
                        </div>

                        <div className="flex items-center justify-center my-4">
                            <div className="w-1/2 mr-2">
                                <label htmlFor="password" className="text-sm font-medium font-Lato">Password</label>
                                <input id="password" type="password" className="mt-2 block w-full p-2 dark:bg-zinc-700 border rounded focus:outline-none focus:ring-1 focus:ring-zinc-100 h-9" />
                            </div>
                            <div className="w-1/2 ml-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium font-Lato">Confirm Password</label>
                                <input id="confirmPassword" type="password" className="mt-2 block w-full p-2 dark:bg-zinc-700 border rounded focus:outline-none focus:ring-1 focus:ring-zinc-100 h-9" />
                            </div>
                        </div>

                        <div className="text-sm flex items-center my-7">
                            <input id="agree" type="checkbox" className="mr-2 leading-tight" required />
                            <label htmlFor="agree">I agree to all the <a href="/#" className="text-blue-500"> Terms, </a><a href="/#" className="text-blue-500"> Privacy Policy </a>.</label>
                        </div>

                        <div className="my-3">
                            <Button type="submit" className="w-full font-semibold p-2">Sign Up</Button>
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
                                Sign Up with Google
                            </Button>
                        </div>

                        <div className="mt-4">
                            <h2>Already have an account? <Link to="/login" className="text-blue-500" onClick={() => handleButtonClick('/login')}>Log In</Link></h2>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
