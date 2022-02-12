import React, { useState, useEffect } from "react";
import Switch from '@mui/material/Switch';

function ThemeToggle() {
    const [checked, setChecked] = useState(true);

    const handleChange = (event) => {
        setChecked(event.target.checked);

        let current_light_theme = localStorage.getItem('currentLightTheme');
        let current_dark_theme = localStorage.getItem('currentDarkTheme');
        let current_theme = localStorage.getItem('theme');

        if (current_theme) {
            document.documentElement.setAttribute('data-theme', current_theme);
        }

        let theme_value = event.target.checked ? current_dark_theme : current_light_theme;
        document.documentElement.setAttribute('data-theme', theme_value);
        localStorage.setItem('theme', theme_value);
    };

    useEffect(() => {
        let current_light_theme = localStorage.getItem('currentLightTheme');
        let current_dark_theme = localStorage.getItem('currentDarkTheme');
        let current_theme = localStorage.getItem('theme');

        if (current_theme) {
            document.documentElement.setAttribute('data-theme', current_theme);
        } else {
            localStorage.setItem('currentLightTheme','Light') 
            // This basically functions as default theme set clearly instead of just using root theme
        }

        if (!current_light_theme) {
            localStorage.setItem('currentLightTheme','Light') 
            // Theme options need to be edited here and in props to theme modal, fix that
        }
        
        if (!current_dark_theme) {
            localStorage.setItem('currentDarkTheme','Dark')
        }
    })

    return (
        <Switch
            checked={checked}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
        />
    );
}

export default ThemeToggle;