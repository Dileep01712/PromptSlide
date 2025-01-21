import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useNavigation } from '../Navigation/Navigate';
import { useGoogleLogin } from '@react-oauth/google';
import CommonFooter from '../Footer/CommonFooter';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const RegisterPage: React.FC = () => {
    const { handleButtonClick } = useNavigation();
    const [formError, setFormError] = useState<string | { msg: string } | null>(null);
    const [showError, setShowError] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    // Handles input changes and clears field-specific errors on user input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        setErrors((prev) => ({ ...prev, [id]: '' })); // Clear error for this field
    };

    const signup = useGoogleLogin({
        flow: "auth-code", // 'auth-code' flow for server-side token exchange
        scope: "email profile", // Define the required Google scopes
        redirect_uri: "http://localhost:5173", // Must match the backend and Google Cloud Console
        onSuccess: async (response) => {
            try {
                // Extract the authorization code
                const { code } = response;

                // Send the auth code and redirect URI to the backend
                await axios.post("http://127.0.0.1:8000/api/user/register/google", {
                    auth_code: code, // Pass the auth code to the backend
                    redirect_uri: "http://localhost:5173", // Include the redirect URI
                });

            } catch (error) {
                handleError(error, "Google OAuth signup failed. Please try again.");
            }
        },
        onError: () => {
            setFormError("Google OAuth signup failed. Please try again.");
            setShowError(true);
        },
    });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Clear formError before validating
        setFormError("");

        // Trim spaces before validation
        const trimmedData = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(),
            password: formData.password.trim(),
        };

        // Validate fields
        const newErrors = {
            firstName: trimmedData.firstName ? "" : "First Name is required",
            lastName: trimmedData.lastName ? "" : "Last Name is required",
            email: trimmedData.email ? "" : "Email is required",
            password: trimmedData.password
                ? trimmedData.password.length < 8
                    ? "Password must be at least 8 characters long"
                    : "" : "Password is required",
        };

        setErrors(newErrors);

        // If any errors exists, stop form submission
        if (Object.values(newErrors).some((error) => error)) {
            return;
        }

        try {
            // Send data to backend for normal user registration
            await axios.post('http://127.0.0.1:8000/api/user/register', {
                user: {
                    firstName: trimmedData.firstName,
                    lastName: trimmedData.lastName,
                    email: trimmedData.email,
                    password: trimmedData.password,
                }
            });

            // Clear the form data after successful submission
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: ''
            });

        } catch (error) {
            handleError(error, "Registration failed. Please try again.");
            setShowError(true)
        }
    };

    // Centralized error handler to process and display API or generic errors
    const handleError = (error: unknown, fallbackMessage: string) => {
        if (axios.isAxiosError(error)) {
            const errorMessage =
                typeof error.response?.data === "string"
                    ? error.response.data
                    : error.response?.data?.detail || fallbackMessage;
            setFormError(errorMessage); // Set the error message for display
        } else {
            setFormError(fallbackMessage); // Handle non-Axios errors
        }
        setShowError(true); // Show the error message on the page
    };

    // Display the error for a limited time
    useEffect(() => {
        if (formError) {
            setShowError(true);
            const timer = setTimeout(() => {
                setShowError(false); // Auto-hide the error after 7 seconds
            }, 7000);

            return () => clearTimeout(timer); // Cleanup on unmount or formError change
        }
    }, [formError]);

    return (
        <>
            <div className="md:h-screen w-full mx-auto mb-4 dark:bg-zinc-950 flex items-center justify-center">
                <div className="flex items-center justify-center">
                    <div className="flex-1 hidden md:block">
                        <img src="../assets/UserAccess/register.webp" alt="Sign up" className="w-[600px]" />
                    </div>
                    <div className="flex-1 px-4">
                        <form onSubmit={handleSubmit}>
                            {formError && (
                                showError && (
                                    <div className="flex items-center mt-5 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                                        <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                        </svg>
                                        <div>
                                            <span className="text-base">
                                                {typeof formError === 'string'
                                                    ? formError
                                                    : formError?.msg || 'An error occurred'}
                                            </span>
                                        </div>
                                    </div>
                                )
                            )}

                            <div className="pb-9">
                                <h1 className="text-2xl font-bold mx-auto">Sign up</h1>
                            </div>

                            <div className="md:w-5/6">
                                <h3 className="mb-3">Manage all your Presentations efficiently</h3>
                                <p className="text-sm">Let's get you all set up so you can verify your personal account and begin setting up your profile.</p>
                            </div>
                            <div className="border-b my-5"></div>

                            <div className="md:flex flex-row items-center justify-center my-5">
                                <div className="md:w-1/2 md:mr-2 md:my-0 my-2">
                                    <label htmlFor="firstName" className="text-sm font-medium font-Lato">First Name</label>
                                    <input id="firstName" type="text" className="mt-2 block w-full p-2 text-black border rounded focus:outline-none h-9" value={formData.firstName} onChange={handleInputChange} />
                                    {errors.firstName && <p className='text-red-500 text-xs'>{errors.firstName}</p>}
                                </div>
                                <div className="md:w-1/2 md:ml-2 md:my-0 my-5">
                                    <label htmlFor="lastName" className="text-sm font-medium font-Lato">Last Name</label>
                                    <input id="lastName" type="text" className="mt-2 block w-full p-2 text-black border rounded focus:outline-none h-9" value={formData.lastName} onChange={handleInputChange} />
                                    {errors.lastName && <p className='text-red-500 text-xs'>{errors.lastName}</p>}
                                </div>
                            </div>

                            <div className="md:flex flex-row items-center justify-center md:my-5">
                                <div className="md:w-1/2 md:mr-2 md:my-0 my-2">
                                    <label htmlFor="email" className="text-sm font-medium font-Lato">Email</label>
                                    <input id="email" type="email" className="mt-2 block w-full p-2 text-black border rounded focus:outline-none h-9" value={formData.email} onChange={handleInputChange} />
                                    {errors.email && <p className='text-red-500 text-xs'>{errors.email}</p>}
                                </div>
                                <div className="md:w-1/2 md:ml-2 md:my-0 my-5">
                                    <label htmlFor="password" className="text-sm font-medium font-Lato">Password</label>
                                    <div className='relative'>
                                        <input id="password" type={showPassword ? "text" : "password"} className="mt-2 block w-full p-2 text-black border rounded focus:outline-none h-9 pr-9" value={formData.password} onChange={handleInputChange} autoComplete='on' />
                                        <button type="button" onClick={() => setShowPassword(prev => !prev)}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black">
                                            {showPassword ? (
                                                <FontAwesomeIcon icon={faEye} fontSize="17px" className='px-[1.1px]' />
                                            ) : (
                                                <FontAwesomeIcon icon={faEyeSlash} fontSize="17px" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && <p className='text-red-500 text-xs'>{errors.password}</p>}
                                </div>
                            </div>

                            <div className="text-sm flex items-center my-5 font-Lato">
                                <label htmlFor="agree">By signing up you agree to our <a href="/#" className="text-blue-500"> Terms, </a>and<a href="/#" className="text-blue-500"> Privacy Policy </a>.</label>
                            </div>

                            <div className="my-5">
                                <Button type="submit" className="w-full font-Lato select-none">Sign up</Button>
                            </div>

                            <div className="my-5 relative flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                                <span className="px-4 bg-white dark:bg-zinc-950 text-gray-500 dark:text-white absolute left-1/2 transform -translate-x-1/2">
                                    or
                                </span>
                            </div>

                            <div className="flex justify-center items-center mx-auto my-5 font-Lato">
                                <Button type='button' onClick={() => signup()} className="w-full select-none">
                                    <img src="./assets/UserAccess/google.svg" alt="Google Logo" className="h-6 mr-3" />
                                    Sign up with Google
                                </Button>
                            </div>

                            <div className="mt-4">
                                <h2>Already have an account? <Link to="/login" className="text-blue-500" onClick={() => handleButtonClick('/login')}>Log in</Link></h2>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <CommonFooter />
        </>
    );
}

export default RegisterPage;
