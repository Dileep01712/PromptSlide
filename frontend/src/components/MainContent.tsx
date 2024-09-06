import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MainContentProps {
    isSidebarExpanded: boolean;
    isLargeScreen: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ isSidebarExpanded, isLargeScreen }) => {
    return (
        <Tabs defaultValue="account" className={`ml-auto bg-bodyColor ${isSidebarExpanded ? 'lg:w-4/5 w-full' : 'lg:w-11/12 w-full'} ${isLargeScreen ? 'p-5' : 'p-1 pb-2'}`}>

            <TabsList className="flex h-11 p-0 mb-2 bg-transparent">
                <TabsTrigger value="account" className='w-1/2 p-3 mr-3 data-[state=active]:bg-buttonColor data-[state=inactive]:hover:bg-inputColor data-[state=active]:text-textColor data-[state=active]:shadow-transparent'>First Response</TabsTrigger>
                <TabsTrigger value="password" className='w-1/2 p-3 ml-3 data-[state=active]:bg-buttonColor data-[state=inactive]:hover:bg-inputColor data-[state=active]:text-textColor data-[state=active]:shadow-transparent'>Second Response</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className='h-[501px] overflow-y-auto scrollbar rounded bg-inputColor'>
                <div className='h-full relative overflow-hidden p-4 justify-items-center rounded animate-pulse before:absolute before:inset-0 before:-translate-x-3/4 before:animate-[shimmer_1.3s_infinite] before:bg-gradient-to-r before:from-transparent efore:via-slate-400'></div>
            </TabsContent>

            <TabsContent value="password" className='h-[501px] overflow-y-auto scrollbar rounded bg-inputColor'>
                <div className='h-full relative overflow-hidden grid p-4 justify-items-center rounded animate-pulse before:absolute before:inset-0 before:-translate-x-3/4 before:animate-[shimmer_1.3s_infinite] before:bg-gradient-to-r before:from-transparent efore:via-slate-400'></div>
            </TabsContent>
        </Tabs>
    );
}

export default MainContent;
