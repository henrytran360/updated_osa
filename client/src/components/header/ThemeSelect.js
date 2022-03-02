import React, { useState } from "react";
import { Button } from '@material-ui/core';
import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
import Select from "react-select";
import { customStylesNoWidth } from '../search/SelectStyles'

function ThemeSelect(props) {
    document.documentElement.setAttribute('data-theme', localStorage.getItem('theme'));
    const handleChange = (theme) => {
        localStorage.setItem(`current${props.themeCategory}Theme`, theme)
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };
    const buttons = [];
    for (let theme of props.themeOptions) {
        theme = theme.value
        buttons.push(
            <Button
                style={{
                    color: "var(--search-background-focused)",
                    border: "1px solid var(--search-background-focused)",
                }}
                variant="outlined"
                onClick={() => handleChange(theme)} key={theme}>
                {theme}
            </Button>);
    }

    return (
        <FormControl fullWidth>
            <p>{props.themeCategory} Themes</p>
            {buttons}
            {/* <Select
                options={props.themeOptions}
                styles={customStylesNoWidth}
                id="theme-select"
            /> */}
        </FormControl>
    );
}

export default ThemeSelect;