import React from 'react';

const MainContent: React.FC = () => {
    return (
        <div className="flex flex-1 main-content">
            <div className="flex-1 p-4 overflow-y-auto response">First Response at the same time</div>
            <div className="flex-1 p-4 overflow-y-auto response">Second Response at the same time</div>
        </div>
    );
}

export default MainContent;
