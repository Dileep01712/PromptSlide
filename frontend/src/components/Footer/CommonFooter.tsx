import React from 'react';
import { useNavigation } from '../Navigation/Navigate';

const CommonFooter: React.FC = () => {
    const { handleButtonClick } = useNavigation();

    return (
        <footer className="z-10">
            <div className='pt-8 pb-1 sm:pt-10 bg-gray-950 text-white dark:bg-zinc-950 dark:text-whitew'>
                <div className='container mx-auto'>
                    <div className='flex flex-wrap'>

                        {/* Website Logo */}
                        <div className='flex flex-col items-center mb-8 w-full sm:items-start'>
                            <div className='flex items-center justify-center cursor-pointer select-none' onClick={() => handleButtonClick('/')}>
                                <div className='flex items-end'>
                                    <img src="./src/assets/Navbar/logo.webp" alt="Logo" className="w-auto h-10" />
                                </div>
                                <div className='inline-block pl-2 font-Varino text-textColor text-2xl'>PROMPTSLIDE</div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className='w-full flex flex-col items-center mt-8 sm:items-start sm:order-none sm:mt-4'>
                            <h3 className='w-full uppercase text-base mb-3 px-6 sm:px-0 font-bold text-center sm:text-left'>SOCIAL MEDIA</h3>

                            <div className="flex flex-wrap items-center justify-start mb-2 sm:grid sm:gap-2 sm:grid-cols-3 xl:grid-cols-4">

                                {/* P Icon */}
                                <a href="https://www.pinterest.es" target="_blank" rel="noreferrer" className="bg-pinterest rounded flex items-center justify-center p-2 bg-red-700 hover:bg-red-600 mr-2 sm:mr-0 focus:outline-none share">
                                    <svg className="fill-current h-5 w-5 text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <title>Pinterest Icon</title>
                                        <path d="M12.053 0.237061C5.513 0.237061 0.184998 5.53806 0.184998 12.1051C0.184998 17.1161 3.323 21.4151 7.727 23.1561C7.622 22.2061 7.543 20.7821 7.78 19.7541C7.991 18.8311 9.178 13.8461 9.178 13.8461C9.178 13.8461 8.835 13.1341 8.835 12.0791C8.835 10.4181 9.785 9.20406 10.971 9.20406C11.974 9.20406 12.475 9.96906 12.475 10.8661C12.475 11.8951 11.815 13.3981 11.499 14.8221C11.209 16.0091 12.079 16.9581 13.266 16.9581C15.376 16.9581 16.985 14.7431 16.985 11.5251C16.985 8.67706 14.954 6.69906 12.026 6.69906C8.651 6.69906 6.673 9.23106 6.673 11.8421C6.673 12.8701 7.068 13.9521 7.543 14.5581C7.648 14.6641 7.648 14.7691 7.622 14.9011C7.542 15.2711 7.332 16.0881 7.305 16.2461C7.253 16.4571 7.121 16.5101 6.91 16.4041C5.433 15.7191 4.51 13.5561 4.51 11.8151C4.51 8.07006 7.226 4.64206 12.343 4.64206C16.457 4.64206 19.648 7.56906 19.648 11.4991C19.648 15.5871 17.064 18.8841 13.503 18.8841C12.29 18.8841 11.183 18.2511 10.787 17.5121C10.787 17.5121 10.18 19.7801 10.048 20.3341C9.785 21.3631 9.046 22.6541 8.571 23.4461C9.679 23.7891 10.866 23.9741 12.079 23.9741C18.619 23.9741 23.947 18.6731 23.947 12.1051C23.895 5.53806 18.593 0.237061 12.053 0.237061Z"></path>
                                    </svg>
                                </a>

                                {/* T Icon */}
                                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="bg-twitter rounded flex items-center justify-center p-2 bg-gray-200 hover:bg-gray-50 mr-2 sm:mr-0 focus:outline-none share">
                                    <svg className="fill-current h-5 w-5 text-black" version="1.1" id="svg5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1668.56 1221.19" xmlSpace="preserve">
                                        <title>Twitter Icon</title>
                                        <g id="layer1" transform="translate(52.390088,-25.058597)">
                                            <path id="path1009" d="M283.94,167.31l386.39,516.64L281.5,1104h87.51l340.42-367.76L984.48,1104h297.8L874.15,558.3l361.92-390.99h-87.51l-313.51,338.7l-253.31-338.7H283.94z M412.63,231.77h136.81l604.13,807.76h-136.81L412.63,231.77z"></path>
                                        </g>
                                    </svg>
                                </a>

                                {/* IG Icon */}
                                <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="bg-instagram rounded flex items-center justify-center p-2 bg-instagram-gradient hover:bg-instagram-gradient-light hover:opacity-100 mr-2 sm:mr-0 focus:outline-none share">
                                    <svg className="fill-current h-5 w-5 text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <title>Instagram Icon</title>
                                        <g clipPath="url(#clip0_2224_13585)">
                                            <path d="M11.9992 2.32032C15.1539 2.32032 15.5242 2.33439 16.7711 2.39064C17.9242 2.4422 18.5477 2.63439 18.9648 2.79845C19.518 3.01407 19.9117 3.2672 20.3242 3.6797C20.7367 4.0922 20.9945 4.48595 21.2055 5.03907C21.3648 5.45626 21.5617 6.0797 21.6133 7.23282C21.6695 8.4797 21.6836 8.85001 21.6836 12.0047C21.6836 15.1594 21.6695 15.5297 21.6133 16.7766C21.5617 17.9297 21.3695 18.5531 21.2055 18.9703C20.9898 19.5234 20.7367 19.9172 20.3242 20.3297C19.9117 20.7422 19.518 21 18.9648 21.2109C18.5477 21.3703 17.9242 21.5672 16.7711 21.6188C15.5242 21.675 15.1539 21.6891 11.9992 21.6891C8.84453 21.6891 8.47422 21.675 7.22734 21.6188C6.07422 21.5672 5.45078 21.375 5.03359 21.2109C4.48047 20.9953 4.08672 20.7422 3.67422 20.3297C3.26172 19.9172 3.00391 19.5234 2.79297 18.9703C2.63359 18.5531 2.43672 17.9297 2.38516 16.7766C2.32891 15.5297 2.31484 15.1594 2.31484 12.0047C2.31484 8.85001 2.32891 8.4797 2.38516 7.23282C2.43672 6.0797 2.62891 5.45626 2.79297 5.03907C3.00859 4.48595 3.26172 4.0922 3.67422 3.6797C4.08672 3.2672 4.48047 3.00939 5.03359 2.79845C5.45078 2.63907 6.07422 2.4422 7.22734 2.39064C8.47422 2.3297 8.84453 2.32032 11.9992 2.32032ZM11.9992 0.1922C8.79297 0.1922 8.38985 0.206262 7.12891 0.262512C5.87266 0.318762 5.01484 0.520325 4.26484 0.81095C3.48672 1.11095 2.83047 1.51876 2.17422 2.17501C1.51797 2.83126 1.11484 3.4922 0.810156 4.26564C0.519531 5.01564 0.317969 5.87345 0.261719 7.13439C0.205469 8.39063 0.191406 8.79376 0.191406 12C0.191406 15.2063 0.205469 15.6094 0.261719 16.8703C0.317969 18.1266 0.519531 18.9844 0.810156 19.7391C1.11016 20.5172 1.51797 21.1734 2.17422 21.8297C2.83047 22.4859 3.49141 22.8891 4.26484 23.1938C5.01484 23.4844 5.87266 23.6859 7.13359 23.7422C8.39453 23.7984 8.79297 23.8125 12.0039 23.8125C15.2148 23.8125 15.6133 23.7984 16.8742 23.7422C18.1305 23.6859 18.9883 23.4844 19.743 23.1938C20.5211 22.8938 21.1773 22.4859 21.8336 21.8297C22.4898 21.1734 22.893 20.5125 23.1977 19.7391C23.4883 18.9891 23.6898 18.1313 23.7461 16.8703C23.8023 15.6094 23.8164 15.2109 23.8164 12C23.8164 8.78907 23.8023 8.39064 23.7461 7.1297C23.6898 5.87345 23.4883 5.01564 23.1977 4.26095C22.8977 3.48282 22.4898 2.82657 21.8336 2.17032C21.1773 1.51407 20.5164 1.11095 19.743 0.806262C18.993 0.515637 18.1352 0.314075 16.8742 0.257825C15.6086 0.206262 15.2055 0.1922 11.9992 0.1922Z"></path>
                                            <path d="M11.9997 5.93439C8.65283 5.93439 5.93408 8.64845 5.93408 12C5.93408 15.3516 8.65283 18.0656 11.9997 18.0656C15.3466 18.0656 18.0653 15.3469 18.0653 12C18.0653 8.65314 15.3466 5.93439 11.9997 5.93439ZM11.9997 15.9375C9.82471 15.9375 8.06221 14.175 8.06221 12C8.06221 9.82501 9.82471 8.06251 11.9997 8.06251C14.1747 8.06251 15.9372 9.82501 15.9372 12C15.9372 14.175 14.1747 15.9375 11.9997 15.9375Z"></path>
                                            <path d="M18.3043 7.11097C19.0861 7.11097 19.7199 6.47718 19.7199 5.69535C19.7199 4.91352 19.0861 4.27972 18.3043 4.27972C17.5225 4.27972 16.8887 4.91352 16.8887 5.69535C16.8887 6.47718 17.5225 7.11097 18.3043 7.11097Z"></path>
                                        </g>
                                    </svg>
                                </a>

                                {/* YT Icon */}
                                <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="bg-youtube rounded flex items-center justify-center p-2 bg-red-700 hover:bg-red-600 sm:mr-0 focus:outline-none share">
                                    <svg className="fill-current h-5 w-5 text-white" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <title>YouTube Icon</title>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M6.35814 7.75533V3.14959L10.54 5.45255L6.35814 7.75533ZM15.6601 1.7004C15.4761 1.02967 14.934 0.501492 14.2456 0.322236C12.9979 -0.00354004 7.99451 -0.00354004 7.99451 -0.00354004C7.99451 -0.00354004 2.99114 -0.00354004 1.74342 0.322236C1.05505 0.501492 0.51287 1.02967 0.32887 1.7004C-0.00549316 2.91604 -0.00549316 5.45246 -0.00549316 5.45246C-0.00549316 5.45246 -0.00549316 7.9888 0.32887 9.20452C0.51287 9.87525 1.05505 10.4034 1.74342 10.5828C2.99114 10.9085 7.99451 10.9085 7.99451 10.9085C7.99451 10.9085 12.9979 10.9085 14.2456 10.5828C14.934 10.4034 15.4761 9.87525 15.6601 9.20452C15.9945 7.9888 15.9945 5.45246 15.9945 5.45246C15.9945 5.45246 15.9945 2.91604 15.6601 1.7004V1.7004Z"
                                        ></path>
                                    </svg>
                                </a>

                            </div>
                        </div>

                        <div className='my-6 mx-auto'>
                            <p className='text-center text-sm'>Copyright © 2024 PromptSlide. All rights reserved.</p>
                        </div>

                    </div>
                </div>
            </div>
        </footer >
    );
};

export default CommonFooter;