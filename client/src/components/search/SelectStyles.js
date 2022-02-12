function option_width(width) {
    if (width) {
        return (styles, { data, isDisabled, isFocused, isSelected }) => {
            return {
                ...styles,
                width: 140,
                backgroundColor: isFocused ? "var(--search-background-focused)" : "var(--border-color)",
                color: "var(--background-color)",
                cursor: isDisabled ? "not-allowed" : "default",
            };
        }

    } else {
        return (styles, { data, isDisabled, isFocused, isSelected }) => {
            return {
                ...styles,
                backgroundColor: isFocused ? "var(--search-background-focused)" : "var(--border-color)",
                color: "var(--background-color)",
                cursor: isDisabled ? "not-allowed" : "default",
            };
        }
    }
}

function control_width(width) {
    if (width) {
        return (base, state) => ({
            ...base,
            color: "var(--primary-color)",
            width: 140,
            borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
            backgroundColor: "var(--tertiary-bg-color)",
            borderColor: "var(--border-color)",
            boxShadow: state.isFocused ? null : null,
            "&:hover": {
                borderColor: state.isFocused ? "var(--search-background-focused)" : "var(--border-color)",
            },
        })
    } else {
        return (base, state) => ({
            ...base,
            color: "var(--primary-color)",
            borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
            backgroundColor: "var(--tertiary-bg-color)",
            borderColor: "var(--border-color)",
            boxShadow: state.isFocused ? null : null,
            "&:hover": {
                borderColor: state.isFocused ? "var(--search-background-focused)" : "var(--border-color)",
            },
        })
    }
}

function single_value() {
    return (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = "opacity 300ms";

        return { ...provided, opacity, transition };
    }
}

const customStyles = {
    option: option_width(true),
    control: control_width(true),
    singleValue: single_value()
};


export default customStyles
export const customStylesNoWidth = {
    option: option_width(false),
    control: control_width(false),
    singleValue: single_value()
};