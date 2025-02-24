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

const LoginPage: React.FC = () => {
    const { handleButtonClick } = useNavigation();
    const [formError, setFormError] = useState<string | { msg: string } | null>(null);
    const [showError, setShowError] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<{
        email: string;
        password: string;
    }>({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const [isNormalLoginLoading, setIsNormalLoginLoading] = useState(false);
    const [isGoogleLoginLoading, setIsGoogleLoginLoading] = useState(false);
    const { setRefreshToken } = useAuth();
    const { allowAccess } = useAccess();
    localStorage.getItem("refreshToken"); // Check if user is logged in

    // Handles input changes and clears field-specific errors on user input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        setErrors((prev) => ({ ...prev, [id]: '' })); // Clear error for this field
    };

    // Helper function to submit pending PPT data after login
    const submitPendingPPT = async (token: string): Promise<boolean> => {
        const pendingPPT = localStorage.getItem("pendingPPT");
        const base64File = localStorage.getItem("pendingPPTFile") || null;

        if (!pendingPPT) return false;
        console.log(`PendingPPT: ${pendingPPT}, base64File: ${base64File}`)

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

    // Google login flow
    const login = useGoogleLogin({
        flow: "auth-code",
        scope: "email profile",
        redirect_uri: "http://localhost:5173",
        onSuccess: async (response) => {
            // Start loading immediately when login is triggered
            setIsGoogleLoginLoading(true);
            try {
                const { code } = response;
                console.log("Google OAuth Code:", code);

                // Exchange the auth code for a token via your backend
                const { data } = await axios.post("http://127.0.0.1:8000/api/user/login/google", {
                    auth_code: code,
                    redirect_uri: "http://localhost:5173",
                });
                console.log("User logged in successfully via Google!!");

                // Extract refresh token from response
                const refreshToken = data.refresh_token;

                setRefreshToken(refreshToken);

                // Store token in localStorage
                localStorage.setItem("refreshToken", refreshToken);

                // Remove refresh token after 7 days (force logout)
                setTimeout(() => {
                    localStorage.removeItem("refreshToken");
                    navigate("/login"); // Redirect user to login page
                }, 7 * 24 * 60 * 60 * 1000); // 7 days

                // Submit any pending PPT data
                const pendingSubmitted = await submitPendingPPT(data.token);
                if (!pendingSubmitted) {
                    navigate("/")
                }
            } catch (error) {
                handleError(error, "Google OAuth log in failed. Please try again.");
            } finally {
                setIsGoogleLoginLoading(false); // Stop the loading indicator regardless of success or error
            }
        },
        onError: () => {
            setFormError("Google OAuth log in failed. Please try again.");
            setShowError(true);
        },
    });

    // Normal form login flow
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Clear any previous errors
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
                    : ""
                : "Password is required",
        };

        // Stop submission if there are any errors
        if (Object.values(newErrors).some((error) => error)) {
            setErrors(newErrors);
            console.log("Some error is there during form submission!!");
            return;
        }

        setIsNormalLoginLoading(true); // No errors, start loading animation

        try {
            // Send login data to backend
            const { data } = await axios.post("http://127.0.0.1:8000/api/user/login", {
                user: {
                    email: trimmedData.email,
                    password: trimmedData.password,
                },
            });
            console.log("User logged in successfully via form!!");

            // Extract refresh token from response
            const refreshToken = data.refresh_token;

            setRefreshToken(refreshToken);

            // Store token in localStorage
            localStorage.setItem("refreshToken", refreshToken);

            // Remove refresh token after 7 days (force logout)
            setTimeout(() => {
                localStorage.removeItem("refreshToken");
                navigate("/login"); // Redirect user to login page
            }, 7 * 24 * 60 * 60 * 1000); // 7 days

            // Clear the form data after successful login
            setFormData({
                email: "",
                password: "",
            });

            // Submit any pending PPT data
            const pendingSubmitted = await submitPendingPPT(data.token);
            if (!pendingSubmitted) {
                navigate("/");
            }
        } catch (error) {
            handleError(error, "Log in failed. Please try again.");
            setShowError(true);
        } finally {
            setIsNormalLoginLoading(false); // Stop loading regardless of the outcome
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
                    <div className="flex-1 hidden md:block select-none">
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
                                <Button type="submit" className="font-Lato w-full select-none mb-1">
                                    {isNormalLoginLoading ? (
                                        <BiLoaderCircle className="animate-spin h-9 w-9" />
                                    ) : (
                                        <span>Log in</span>
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
                                <Button type='button' onClick={() => login()} className="w-full select-none">
                                    {isGoogleLoginLoading ? (
                                        <BiLoaderCircle className="animate-spin h-9 w-9" />
                                    ) : (
                                        <>
                                            <img src="./assets/UserAccess/google.svg" alt="Google Logo" className="h-6 mr-3" />
                                            <span>Log in with Google</span>
                                        </>
                                    )}
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
