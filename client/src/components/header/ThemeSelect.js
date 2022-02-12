import React, { useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
import Select from "react-select";
import {customStylesNoWidth} from '../search/SelectStyles'

function ThemeSelect(props) {
    const [theme, setTheme] = useState('');
    console.log('Theme Options: ', props.themeOptions)
    let themes = []
    for (let themeOption of props.themeOptions) {
        themes.push(<MenuItem key={themeOption} value={themeOption}>{themeOption}</MenuItem>)
    }

    const handleChange = (event) => {
        setTheme(event.target.value);
        localStorage.setItem(`current${props.themeCategory}Theme`, event.target.value)
        document.documentElement.setAttribute('data-theme', event.target.value);
        localStorage.setItem('theme', event.target.value);
    };

    return (
        <FormControl fullWidth>
            <InputLabel id="theme-select-label">{props.themeCategory}</InputLabel>
                <Select
                    value={theme}
                    onChange={handleChange}
                    options={themes}
                    styles={customStylesNoWidth}
                    id="theme-select"
                />


            {/* <Select
                labelId="theme-select-label"
                id="theme-select"
                value={theme}
                label="Theme Options"
                onChange={handleChange}
                styles={customStylesNoWidth}
            >
            </Select> */}
        </FormControl>
    );
}

export default ThemeSelect;