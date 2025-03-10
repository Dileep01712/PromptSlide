import React, { useState } from "react";

interface ThemesProps {
    onThemeSelect: (themeId: number) => void;
}

const Themes: React.FC<ThemesProps> = ({ onThemeSelect }) => {
    // Manage the selected theme state (default is 0)
    const [selectedTheme, setSelectedTheme] = useState<number>(0);
    const themes = [0, 1, 2, 3, 4, 5]; // IDs for themes

    // Handler to update state and notify the parent component
    const handleChange = (themeId: number) => {
        setSelectedTheme(themeId);
        onThemeSelect(themeId); // Pass the selected id to the parent or use for routing
        console.log("Theme selected:", themeId);
    };

    return (
        <div>
            {/* Themes Designs */}
            <div className="w-full grid grid-cols-3 md:gap-4 gap-2">
                {themes.map((id) => (
                    <div key={id} className='flex flex-wrap box-border rounded-md hover:shadow-[0_0_10px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] hover:scale-105 transition-transform duration-300'>
                        <label className="relative cursor-pointer w-full rounded-md overflow-hidden border-[3px] dark:border-slate-200 border-black z-10">
                            <input className="hidden peer" type="radio" name="style" autoComplete="off" value={id} checked={selectedTheme === id} onChange={() => handleChange(id)} />

                            <img src={`./assets/Templates/template${id}.webp`} alt={`Template ${id}`} className='w-full scale-105 transition-transform duration-300 md:h-32' />

                            <span className="hidden absolute top-2.5 right-2.5 size-4 items-center justify-center bg-purple-700 rounded-sm peer-checked:flex">
                                <svg className="fill-current w-2.5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                    <path d="M4.89321 13.6582C4.64475 13.6582 4.39628 13.5635 4.20669 13.3739L0.284359 9.45155C-0.0947864 9.07241 -0.0947864 8.45765 0.284359 8.07854C0.663544 7.69936 1.27822 7.69936 1.65737 8.07854L4.89384 11.315L14.3433 1.88371C14.7227 1.50491 15.3375 1.50546 15.7163 1.88499C16.0951 2.26449 16.0945 2.87924 15.715 3.258L5.57908 13.3745C5.38956 13.5637 5.14133 13.6582 4.89321 13.6582Z">
                                    </path>
                                </svg>
                            </span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Themes;