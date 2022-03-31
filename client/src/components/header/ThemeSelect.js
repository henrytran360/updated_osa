import React, { useState } from "react";
import { Button } from '@material-ui/core';
import FormControl from '@mui/material/FormControl';
import { gql, useApolloClient, useQuery} from "@apollo/client";
// import Select from '@mui/material/Select';
import Select from "react-select";
import { customStylesNoWidth } from '../search/SelectStyles'

const GET_LOCAL_DATA = gql`
    query GetLocalData {
        theme @client
    }
`;

function ThemeSelect(props) {

    const customStyles = {
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            return {
                ...styles,
                width: "auto",
                backgroundColor: isFocused
                    ? "var(--primary-color)"
                    : "var(--border-color)",
                color: "var(--background-color)",
                cursor: isDisabled ? "not-allowed" : "default",
            };
        },
        control: (base, state) => ({
            ...base,
            color: "var(--primary-color)",
            zIndex: 0,
            borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
            borderColor: "var(--border-color)",
            borderColor: state.isFocused
                ? "var(--border-color)"
                : "var(--border-color)",
            borderColor: "var(--border-color)",
            boxShadow: state.isFocused ? null : null,
            "&:hover": {
                borderColor: state.isFocused
                    ? "var(--primary-color)"
                    : "var(--border-color)",
            },
        }),
        singleValue: (provided, state) => {
            const opacity = state.isDisabled ? 0.5 : 1;
            const transition = "opacity 300ms";
    
            return { ...provided, opacity, transition };
        },
    };

    const client = useApolloClient();
    let { data: storeData } = useQuery(GET_LOCAL_DATA);
    // Get the theme
    let { theme } = storeData;
    const handleChange = (currentTheme) => {
        localStorage.setItem(`current${props.themeCategory}Theme`, currentTheme.value)
        document.documentElement.setAttribute('data-theme', currentTheme.value);
        localStorage.setItem('theme', currentTheme.value);

        client.writeQuery({
            query: GET_LOCAL_DATA,
            data: { theme: currentTheme },
        });
    };
    
    return (
        <FormControl fullWidth>
                <Select
                    className="react-select-container"
                    value={theme}
                    label={theme.value}
                    onChange={handleChange}
                    options={props.themeOptions}
                    maxMenuHeight={144}
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            text: "red",
                            primary25: "var(--border-color)",
                            primary: "var(--border-color)",
                        },
                    })}
                    styles={customStyles}
                />
        </FormControl>      
    );
}

export default ThemeSelect;