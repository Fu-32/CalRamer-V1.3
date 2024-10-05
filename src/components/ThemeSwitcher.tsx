"use client";

import { useState, useEffect } from 'react';

const ThemeSwitcher = () => {
    const [theme, setTheme] = useState('mytheme');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTheme = event.target.value;
        setTheme(selectedTheme);
    };

    return (
        <div className="mt-4 mb-4 ml-4">
            <label htmlFor="theme-select" className="mr-2">Choose theme:</label>
            <select id="theme-select" value={theme} onChange={handleThemeChange} className="select select-bordered">
                <option value="mytheme">My Theme</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="cupcake">Cupcake</option>
            </select>
        </div>
    );
};

export default ThemeSwitcher;