import React from 'react';
import { Button } from '../ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '../Navigation/Navigate';
import CommonFooter from '../Footer/CommonFooter';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const LandingPage: React.FC = () => {
    const { handleButtonClick } = useNavigation();

    return (
        <>
            <main className='relative flex flex-col sm:z-0 sm:mt-0'>
                <div className="pb-14 relative flex flex-col sm:z-0 sm:mt-0 bg-white dark:bg-zinc-950">
                    {/* Header Section */}
                    <header className="lg:grid lg:grid-cols-2 mx-auto max-w-screen-xl lg:my-7 my-5 relative px-4 lg:px-8">
                        <div className='mx-auto flex flex-col justify-center w-full relative z-10 sm:text-center lg:pr-12 lg:text-left lg:col-span-1'>
                            <h1 className="font-Degular text-gray-900 dark:text-white mb-5 lg:text-left text-center lg:text-5xl text-3xl">AI presentation maker</h1>
                            <p className="text-gray-800 dark:text-white md:text-xl mb-8 md:leading-relaxed leading-relaxed md:text-justify">
                                If you're feeling uninspired or short on time, it's smart to ask for help. PromptSlide is here to assist you with its new feature—the AI presentation maker! With just a few clicks, you can create amazing slideshows that fit your needs. Best of all, it's completely free!
                            </p>
                            <div className='flex flex-col items-center justify-center mx-auto lg:mx-0 sm:flex-row group w-fit font-Degular my-3 md:mb-8 rounded-full'>
                                <Button className="h-14 px-8 rounded-full text-white dark:text-black text-xl font-semibold flex items-center gap-4" onClick={() => handleButtonClick('/create-presentation')}>
                                    Get Started
                                    <FontAwesomeIcon icon={faArrowRight} className="transition-transform transform group-hover:translate-x-1" />
                                </Button>
                            </div>
                        </div>
                        <div className='flex flex-col gap-4 lg:col-span-1 pt-5 md:pt-0'>
                            <img src="./assets/Landing/generated.webp" alt="Generated Logo" />
                        </div>
                    </header>

                    {/* Features Section */}
                    <div className="mx-auto lg:my-7 mt-5">
                        <h1 className="text-center font-Degular text-gray-900 dark:text-white mx-10 lg:text-5xl text-3xl">Features</h1>
                        <div className="lg:grid lg:grid-cols-3 mx-auto max-w-screen-xl relative px-4 p-5 lg:px-8">
                            <div className="flex flex-col sm:text-center lg:col-span-1 p-6 bg-blue-100 rounded-3xl shadow-lg mb-8 md:m-2 transition-transform duration-300 lg:hover:scale-105 lg:hover:shadow-xl cursor-pointer">
                                <div className='flex flex-col gap-4 lg:col-span-1 rounded-xl overflow-hidden'>
                                    <img src="./assets/Landing/features1.webp" alt="Logo" />
                                </div>
                                <div className='pt-6'>
                                    <h3 className="text-center font-Degular text-gray-900 mb-3 lg:text-3xl text-xl">AI-Powered Content Creation</h3>
                                    <p className="text-gray-800 text-lg">
                                        Automatically generate slides based on your input. Just provide some details about what you want to share, and it will make beautiful slides for you.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:text-center lg:col-span-1 bg-blue-100 p-6 rounded-3xl shadow-lg mb-8 md:m-2 transition-transform duration-300 lg:hover:scale-105 lg:hover:shadow-xl cursor-pointer">
                                <div className='flex flex-col gap-4 lg:col-span-1 rounded-xl overflow-hidden'>
                                    <img src="./assets/Landing/features2.webp" alt="Logo" />
                                </div>
                                <div className='pt-6'>
                                    <h3 className="text-center font-Degular text-gray-900 mb-3 lg:text-3xl text-xl">Customizable Templates</h3>
                                    <p className="text-gray-800 text-lg">
                                        You can find designs that suit any occasion, whether it’s for school, work, or personal projects. Each template is created by experts and can be easily changed to match your style.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:text-center lg:col-span-1 bg-blue-100 p-6 rounded-3xl shadow-lg mb-8 md:m-2 transition-transform duration-300 lg:hover:scale-105 lg:hover:shadow-xl cursor-pointer">
                                <div className='flex flex-col gap-4 lg:col-span-1 rounded-xl overflow-hidden'>
                                    <img src="./assets/Landing/features3.webp" alt="Logo" className="lg:h-56 md:h-96" style={{
                                        height: window.innerWidth < 440 ? "11rem" : window.innerWidth >= 440 && window.innerWidth < 768
                                            ? "319px" : ""}} />
                                </div>
                                <div className='pt-6'>
                                    <h3 className="text-center font-Degular text-gray-900 mb-3 lg:text-3xl text-xl">Easy Editing Tools</h3>
                                    <p className="text-gray-800 text-lg">
                                        You can move elements around with your mouse, resize images, and change text without needing special skills. This makes it quick to create unique slides that reflect your ideas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* How Works Section */}
                    <div className="lg:my-7 my-5 lg:px-8 px-4">
                        <div className='max-w-screen-xl mx-auto md:px-10'>
                            <h2 className="lg:text-5xl text-3xl font-semibold text-center">
                                <span className="text-blue-600 font-Degular h-fit">How does</span> <span className="text-black dark:text-white font-Degular">it work?</span>
                            </h2>
                            <div className="mt-10 flex flex-col items-start justify-start gap-6">
                                <div>
                                    <h3 className='text-2xl font-bold text-left mb-2 flex items-center'>Identify your central theme</h3>
                                    <p className='text-gray-800 dark:text-white text-left mb-6 leading'>
                                        Begin by brainstorming the main subject you want to present. This could be anything from a business idea, a school project, or a personal passion. Take some time to jot down your thoughts and ideas related to the topic. Consider the key messages you want to convey and the audience you are targeting. Understanding your topic thoroughly will help you create a more focused and engaging presentation.
                                    </p>
                                </div>
                                <div>
                                    <h3 className='text-2xl font-bold text-left mb-2 flex items-center'>Select your design</h3>
                                    <p className='text-gray-800 dark:text-white text-left mb-6 leading-normal'>
                                        Once you have a clear topic in mind, the next step is to select the style and tone that best fits your message. Consider whether you want your presentation to be formal, casual, informative, or persuasive. The style can significantly impact how your audience perceives your content. For instance, a business presentation may require a more professional tone, while a creative project might benefit from a more relaxed and artistic approach.
                                    </p>
                                </div>
                                <div>
                                    <h3 className='text-2xl font-bold text-left mb-2 flex items-center'>Polish your content for impact</h3>
                                    <p className='text-gray-800 dark:text-white text-left mb-6 leading-normal'>
                                        After selecting your style and tone, it’s time to refine your content. Review your slides and make any necessary adjustments to ensure clarity and coherence. This may involve editing text for conciseness, adding visuals to support your points, or rearranging slides for better flow.
                                    </p>
                                </div>
                                <div>
                                    <h3 className='text-2xl font-bold text-left mb-2 flex items-center'>Save your presentation at no cost</h3>
                                    <p className='text-gray-800 dark:text-white text-left mb-6 leading-normal'>
                                        Once you are satisfied with your presentation, it’s time to download the final product. Most platforms offer a straightforward download process, allowing you to save your work in various formats, such as PDF or PowerPoint. Ensure that you review the final version one last time to check for any formatting issues or errors.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQs Section */}
                    <div className='js-scroll md:mb-10 px-4 mx-auto w-full sm:max-w-screen-xl lg:my-7 py-5 lg:px-8 scrolled'>
                        <h2 className='font-bold mb-6 mx-auto text-center lg:text-5xl text-3xl dark:text-white'>FAQs</h2>
                        <div className='flex flex-col gap-4'>
                            <div className='bg-gray-50 rounded-lg hover:bg-gray-100 dark:bg-zinc-950 py-2 md:px-7 px-4'>
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="font-bold text-lg">What is an AI-generated presentation?</AccordionTrigger>
                                        <AccordionContent className="text-gray-800 dark:text-white leading-normal text-base">
                                            <span>
                                                It’s exactly “what it says on the cover”. AIs, or artificial intelligences, are in constant evolution, and they are now able to generate presentations in a short time, based on inputs from the user. This technology allows you to get a satisfactory presentation much faster by doing a big chunk of the work.
                                            </span>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                            <div className='bg-gray-50 rounded-lg hover:bg-gray-100 dark:bg-zinc-950 py-2 md:px-7 px-4'>
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger className="font-bold text-lg">Can I customize the presentation generated by the AI?</AccordionTrigger>
                                        <AccordionContent className="text-gray-800 dark:text-white leading-normal text-base">
                                            <span>
                                                Of course! That’s the point! PromptSlide is all for customization since day one, so you’ll be able to make any changes to presentations generated by the AI. We humans are irreplaceable, after all! Thanks to the online editor, you can do whatever modifications you may need, without having to install any software. Colors, text, images, icons, placement, the final decision concerning all of the elements is up to you.
                                            </span>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                            <div className='bg-gray-50 rounded-lg hover:bg-gray-100 dark:bg-zinc-950 py-2 md:px-7 px-4'>
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="font-bold text-lg px-0.5">Are there more presentation designs available?</AccordionTrigger>
                                        <AccordionContent className="leading-normal text-gray-800 dark:text-white text-base">
                                            <span>
                                                From time to time, we’ll be adding more designs. If you feel like you want to do things yourself and don’t want to rely on an AI, you’re on PromptSlide, the leading website when it comes to presentation templates.
                                            </span>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                            <div className='bg-gray-50 rounded-lg hover:bg-gray-100 dark:bg-zinc-950 py-2 md:px-7 px-4'>
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="font-bold text-lg">How can I download my presentation?</AccordionTrigger>
                                        <AccordionContent className="text-gray-800 dark:text-white leading-normal text-base">
                                            <span>
                                                The easiest way is to click on “Download” to get your presentation in .pdf format. But there are other options! You can click on “Present” to enter the presenter view and start presenting right away!.
                                            </span>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                            <div className='bg-gray-50 rounded-lg hover:bg-gray-100 dark:bg-zinc-950 py-2 md:px-7 px-4'>
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="font-bold text-lg">Can I add my own images?</AccordionTrigger>
                                        <AccordionContent className="text-gray-800 dark:text-white leading-normal text-base">
                                            <span>
                                                Absolutely. That’s a basic function, and we made sure to have it available. Would it make sense to have a portfolio template generated by an AI without a single picture of your own work? In any case, we also offer the possibility of asking the AI to generate images for you via prompts. If making an impression is your goal, you’ll have an easy time!
                                            </span>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <CommonFooter />
        </>
    );
};

export default LandingPage;