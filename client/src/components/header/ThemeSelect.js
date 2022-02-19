import React, { useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
import Select from "react-select";
import { customStylesNoWidth } from '../search/SelectStyles'

function ThemeSelect(props) {
    const handleChange = (event) => {
        localStorage.setItem(`current${props.themeCategory}Theme`, event.value)
        document.documentElement.setAttribute('data-theme', event.value);
        localStorage.setItem('theme', event.value);
    };

    return (
        <FormControl fullWidth>
            <p>{props.themeCategory} Themes</p>
            {/* <InputLabel id="theme-select-label">{props.themeCategory}</InputLabel> */}
            <Select
                onChange={handleChange}
                options={props.themeOptions}
                styles={customStylesNoWidth}
                id="theme-select"
            />
        </FormControl>
    );
}

export default ThemeSelect;