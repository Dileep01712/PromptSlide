import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useNavigation } from '../Navigation/Navigate';
import { useGoogleLogin } from '@react-oauth/google';
import CommonFooter from '../Footer/CommonFooter';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const LoginPage: React.FC = () => {
    const { handleButtonClick } = useNavigation();
    const [formError, setFormError] = useState<string | { msg: string } | null>(null);
    const [showError, setShowError] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    // Handles input changes and clears field-specific errors on user input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        setErrors((prev) => ({ ...prev, [id]: '' })); // Clear error for this field
    };

    const login = useGoogleLogin({
        flow: "auth-code",
        scope: "email profile",
        redirect_uri: "http://localhost:5173",
        onSuccess: async (response) => {
            try {
                // Extract the authorization code
                const { code } = response;
                console.log("Google OAuth Code:", code);

                // Send auth code to backend for verification & token exchange
                const { data } = await axios.post("http://127.0.0.1:8000/api/user/login/google", {
                    auth_code: code,
                    redirect_uri: "http://localhost:5173",
                })
                console.log("User logged in successfully!!")

                // Store authentication token
                localStorage.setItem("authToken", data.token)

            } catch (error) {
                handleError(error, "Google OAuth log in failed. Please try again.");
            }
        },
        onError: () => {
            setFormError("Google OAuth log in failed. Please try again.")
            setShowError(true)
        },
    });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Clear formError before validating
        setFormError("");

        // Trim spaces before validation
        const trimmedData = {
            email: formData.email.trim(),
            password: formData.password.trim(),
        };
        console.log("User data: ", trimmedData);

        // Validate fields
        const newErrors = {
            email: trimmedData.email ? "" : "Email is required",
            password: trimmedData.password
                ? trimmedData.password.length < 8
                    ? "Password must be at least 8 characters long"
                    : "" : "Password is required",
        };

        // If any errors exists before setting the this.state
        if (Object.values(newErrors).some((error) => error)) {
            setErrors(newErrors);
            console.log("Some kind of error is there during form submission!!");
            return; // Stop submission if there are errors
        }

        try {
            // Send data to backend for login
            const { data } = await axios.post('http://127.0.0.1:8000/api/user/login', {
                user: {
                    email: trimmedData.email,
                    password: trimmedData.password,
                }
            });
            console.log("User logged in successfully!!")

            // Store authentication token
            localStorage.setItem("authToken", data.token);

            // Clear the form data after successful login
            setFormData({
                email: '',
                password: ''
            });

        } catch (error) {
            handleError(error, "Log in failed. Please try again.");
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

    useEffect(() => {
        if (formError) {
            setShowError(true);
            const timer = setTimeout(() => {
                setShowError(false);
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [formError]);

    // Reset errors only on component mount
    useEffect(() => {
        setErrors({
            email: '',
            password: ''
        });
        setFormError(null);
        setShowError(false);
    }, []);

    return (
        <>
            <div className="md:h-screen w-full mx-auto mb-4 dark:bg-zinc-950 flex items-center justify-center">
                <div className="flex items-center justify-center">
                    <div className="flex-1 hidden md:block">
                        <img src="../assets/UserAccess/login.webp" alt="Log in" className="w-[496.5px]" />
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
                                <h1 className="text-2xl font-bold mx-auto">Log in</h1>
                            </div>

                            <div className="md:w-5/6">
                                <h3 className="mb-3">Login to your account</h3>
                                <p className="text-sm">Thank you for connecting with us at PromptSlide. We are pleased to provide you with our top recommendations.</p>
                            </div>
                            <div className="border-b my-5"></div>

                            <div className="mx-auto my-5">
                                <label htmlFor="email" className="text-sm font-medium font-Lato">Email</label>
                                <input id="email" type="email" className="mt-2 block w-full p-2 text-black border rounded focus:outline-none h-9" value={formData.email} onChange={handleInputChange} />
                                {errors.email && <p className='text-red-500 text-xs'>{errors.email}</p>}
                            </div>

                            <div className="mx-auto md:my-5 my-5">
                                <label htmlFor="password" className="text-sm font-medium font-Lato">Password</label>
                                <div className='relative'>
                                    <input id="password" type={showPassword ? "text" : "password"} className="mt-2 block w-full p-2 text-black border rounded focus:outline-none h-9 pr-9" autoComplete='on' value={formData.password} onChange={handleInputChange} />
                                    <button type="button" onClick={() => setShowPassword(prev => !prev)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black">
                                        {showPassword ? (
                                            <FontAwesomeIcon icon={faEye} fontSize="17px" className='px-[1px]' />
                                        ) : (
                                            <FontAwesomeIcon icon={faEyeSlash} fontSize="17px" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p className='text-red-500 text-xs'>{errors.password}</p>}
                            </div>

                            <div className="mx-auto flex items-center justify-between my-5">
                                <Link to="/forgot-password" className="font-Lato text-blue-500 text-sm">Forgot Password?</Link>
                            </div>

                            <div className="mx-auto my-5">
                                <Button type="submit" className="font-Lato w-full select-none">Log in</Button>
                            </div>

                            <div className="my-5 relative flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                                <span className="px-4 bg-white dark:bg-zinc-950 text-gray-500 dark:text-white absolute left-1/2 transform -translate-x-1/2">
                                    or
                                </span>
                            </div>

                            <div className="flex justify-center items-center mx-auto my-5 font-Lato">
                                <Button type='button' onClick={() => login()} className="w-full select-none">
                                    <img src="./assets/UserAccess/google.svg" alt="Google Logo" className="h-6 mr-3" />
                                    Log in with Google
                                </Button>
                            </div>

                            <div className="mx-auto mt-4">
                                <h2>Don't have an account? <Link to="/signup" className="text-blue-500" onClick={() => handleButtonClick('/signup')}>Sign up</Link></h2>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <CommonFooter />
        </>
    );
};

export default LoginPage;
