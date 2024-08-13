import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MainContentProps {
    isSidebarExpanded: boolean;
    isLargeScreen: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ isSidebarExpanded, isLargeScreen }) => {
    return (
        <Tabs defaultValue="account" className={`ml-auto bg-bodyColor ${isSidebarExpanded ? 'lg:w-10/12 w-full' : 'lg:w-full w-full'} ${isLargeScreen ? 'p-5' : 'p-1 pb-2'}`}>
            <TabsList className="flex h-11 p-0 mb-2 bg-transparent">
                <TabsTrigger value="account" className='w-1/2 p-3 mr-3 data-[state=active]:bg-buttonColor data-[state=inactive]:hover:bg-inputColor data-[state=active]:text-textColor data-[state=active]:shadow-transparent'>First Response</TabsTrigger>
                <TabsTrigger value="password" className='w-1/2 p-3 ml-3 data-[state=active]:bg-buttonColor data-[state=inactive]:hover:bg-inputColor data-[state=active]:text-textColor data-[state=active]:shadow-transparent'>Second Response</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className={`overflow-y-auto scrollbar rounded bg-indigo-500 ${isLargeScreen ? 'h-[84.1%]' : 'h-[79%]'}`}>
                <div className="flex p-4 overflow-y-auto justify-center">

                </div>
            </TabsContent>
            <TabsContent value="password" className={`overflow-y-auto scrollbar rounded bg-indigo-500 ${isLargeScreen ? 'h-[84.1%]' : 'h-[79%]'}`}>
                <div className="flex overflow-y-auto justify-center">

                </div>
            </TabsContent>
        </Tabs>
    );
}

export default MainContent;
