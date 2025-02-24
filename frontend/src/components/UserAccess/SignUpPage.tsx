import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useNavigation } from '../Navigation/Navigate';
import { useGoogleLogin } from '@react-oauth/google';
import CommonFooter from '../Footer/CommonFooter';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import { BiLoaderCircle } from "react-icons/bi";
import { useAuth } from '../context/useAuth';
import { useAccess } from '../context/useAccess';

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
    const navigate = useNavigate();
    const [isNormalSignupLoading, setIsNormalSignupLoading] = useState(false);
    const [isGoogleSignupLoading, setIsGoogleSignupLoading] = useState(false);
    const { setRefreshToken } = useAuth();
    const { allowAccess } = useAccess();
    localStorage.getItem("refreshToken"); // Check if user is logged in

    // Handles input changes and clears field-specific errors on user input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        setErrors((prev) => ({ ...prev, [id]: '' })); // Clear error for this field
    };

    // // Helper function to submit pending PPT data if available
    const submitPendingPPT = async (token: string): Promise<boolean> => {
        const pendingPPT = localStorage.getItem("pendingPPT");
        const base64File = localStorage.getItem("pendingPPTFile") || null;

        if (!pendingPPT) return false;
        console.log(`PendingPPT: ${pendingPPT}, base64File: ${base64File}`);

        try {
            const pendingData = JSON.parse(pendingPPT);
            const formDataToSend = new FormData();

            // Append all fields from pending data
            Object.entries(pendingData).forEach(([key, value]) => {
                formDataToSend.append(key, String(value));
            });

            if (base64File) {
                // Extract the MIME type from the Base64 string
                // Example prefix: "data:application/pdf;base64," or "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,"
                const mimeStringMatch = base64File.match(/^data:([^;]+);/);
                const mimeType = mimeStringMatch ? mimeStringMatch[1] : "application/octet-stream";

                // Determine a filename based on MIME type
                let fileName = "document";
                if (mimeType === "application/pdf") {
                    fileName += ".pdf";
                } else if (
                    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                    mimeType === "application/msword"
                ) {
                    fileName += ".docx";
                }

                // Remove the data URL prefix and decode the Base64 string
                const base64Data = base64File.split(",")[1];
                const byteCharacters = atob(base64Data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: mimeType });

                // Create a File object from the blob
                const restoredFile = new File([blob], fileName, { type: mimeType });

                // Append the restored file (FastAPI expects this as an UploadFile)
                formDataToSend.append("file", restoredFile, restoredFile.name);
                // console.log(`Restored File: ${restoredFile}`);
            }
            for (const pair of formDataToSend.entries()) {
                console.log(pair[0], pair[1]);
            }
            // Note: Do not manually set Content-Type; let the browser handle it
            const response = await fetch("http://127.0.0.1:8000/api/user/user_input", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formDataToSend,
            });

            if (response.ok) {
                localStorage.removeItem("pendingPPT");
                localStorage.removeItem("pendingPPTFile");
                allowAccess();
                navigate("/ppt_viewer");
                return true;
            } else {
                console.error("Failed to submit pending data", await response.text());
                return false;
            }
        } catch (error) {
            console.error("Error submitting pending PPT:", error);
            return false;
        }
    };

    // Google Sign-Up
    const signup = useGoogleLogin({
        flow: "auth-code", // 'auth-code' flow for server-side token exchange
        scope: "email profile", // Define the required Google scopes
        redirect_uri: "http://localhost:5173", // Must match the backend and Google Cloud Console
        onSuccess: async (response) => {
            setIsGoogleSignupLoading(true); // Start loading
            try {
                // Extract the authorization code
                const { code } = response;
                console.log("Google OAuth Code: ", code);

                // Send the auth code and redirect URI to the backend for Google sign-up
                const { data } = await axios.post("http://127.0.0.1:8000/api/user/signup/google", {
                    auth_code: code,
                    redirect_uri: "http://localhost:5173",
                });
                console.log("User registered successfully via Google!!");

                // Extract refresh token from response
                const refreshToken = data.refresh_token;

                setRefreshToken(refreshToken)

                // Store token in localStorage
                localStorage.setItem("refreshToken", refreshToken);

                // Remove refresh token after 7 days (force logout)
                setTimeout(() => {
                    localStorage.removeItem("refreshToken");
                    navigate("/login"); // Redirect user to login page
                }, 7 * 24 * 60 * 60 * 1000); // 7 days

                // Submit pending PPT data if available, otherwise redirect to home
                const pendingSubmitted = await submitPendingPPT(data.token);
                if (!pendingSubmitted) {
                    navigate("/");
                }
            } catch (error) {
                handleError(error, "Google OAuth sign up failed. Please try again.");
            } finally {
                setIsGoogleSignupLoading(false); // Stop loading regardless of outcome
            }
        },
        onError: () => {
            setFormError("Google OAuth sign up failed. Please try again.");
            setShowError(true);
        },
    });

    // Normal form Sign-Up
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
        console.log("Trimmed data: ", trimmedData);

        // Validate fields
        const newErrors = {
            firstName: trimmedData.firstName ? "" : "First Name is required",
            lastName: trimmedData.lastName ? "" : "Last Name is required",
            email: trimmedData.email ? "" : "Email is required",
            password: trimmedData.password
                ? trimmedData.password.length < 8
                    ? "Password must be at least 8 characters long"
                    : ""
                : "Password is required",
        };

        // If any errors exist, update state and stop submission
        if (Object.values(newErrors).some((error) => error)) {
            setErrors(newErrors);
            console.log("Some error is there during form submission!!");
            return;
        }

        setIsNormalSignupLoading(true); // Start loading after validations pass

        try {
            // Send data to backend for normal user registration
            const { data } = await axios.post("http://127.0.0.1:8000/api/user/signup", {
                user: {
                    firstName: trimmedData.firstName,
                    lastName: trimmedData.lastName,
                    email: trimmedData.email,
                    password: trimmedData.password,
                },
            });
            console.log("User registered successfully via form!!");

            // Extract refresh token from response
            const refreshToken = data.refresh_token;

            setRefreshToken(refreshToken)

            // Store token in localStorage
            localStorage.setItem("refreshToken", refreshToken);

            // Remove refresh token after 7 days (force logout)
            setTimeout(() => {
                localStorage.removeItem("refreshToken");
                navigate("/login"); // Redirect user to login page
            }, 7 * 24 * 60 * 60 * 1000); // 7 days

            // Clear the form data after successful submission
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
            });

            // Submit pending PPT data if available, otherwise redirect to home
            const pendingSubmitted = await submitPendingPPT(data.token);
            if (!pendingSubmitted) {
                navigate("/");
            }
        } catch (error) {
            console.log(error);
            handleError(error, "Registration failed. Please try again.");
            setShowError(true);
        } finally {
            setIsNormalSignupLoading(false); // Stop loading regardless of outcome
        }
    };

    // Centralized error handler to process and display API or generic errors
    const handleError = (error: unknown, fallbackMessage: string) => {
        if (axios.isAxiosError(error)) {
            const errorMessage =
                typeof error.response?.data === "string"
                    ? error.response.data
                    : error.response?.data?.detail || fallbackMessage;
            setFormError(errorMessage);
        } else {
            setFormError(fallbackMessage);
        }
        setShowError(true);
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
            firstName: '',
            lastName: '',
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
                    <div className="flex-1 hidden md:block select-none">
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
                                <Button type="submit" className="w-full font-Lato select-none mb-1">
                                    {isNormalSignupLoading ? (
                                        <BiLoaderCircle className="animate-spin h-9 w-9" />
                                    ) : (
                                        <span>Sign up</span>
                                    )}
                                </Button>
                            </div>

                            <div className="my-5 relative flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                                <span className="px-4 bg-white dark:bg-zinc-950 text-gray-500 dark:text-white absolute left-1/2 transform -translate-x-1/2">
                                    or
                                </span>
                            </div>

                            <div className="flex justify-center items-center mx-auto my-5 font-Lato">
                                <Button type="button" onClick={() => signup()} className="w-full select-none flex items-center justify-center">
                                    {isGoogleSignupLoading ? (
                                        <BiLoaderCircle className="animate-spin h-9 w-9" />
                                    ) : (
                                        <>
                                            <img src="./assets/UserAccess/google.svg" alt="Google Logo" className="h-6 mr-3" />
                                            <span>Sign up with Google</span>
                                        </>
                                    )}
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
