import React, { useState, useEffect } from "react";
import Select from "react-select";
import { gql, useApolloClient, useQuery } from "@apollo/client";
const GET_LOCAL_DATA = gql`
    query GetLocalData {
        term @client
    }
`;
const QUERY_USER_SCHEDULES = gql`
    query scheduleMany {
        scheduleMany {
            _id
            term
        }
    }
`;

const customStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            width: 200,
            backgroundColor: isFocused ? "#1DC2C4" : "#BBECED",
            color: "#FFF",
            cursor: isDisabled ? "not-allowed" : "default",
        };
    },
    control: (base, state) => ({
        ...base,
        color: "#1DC2C4",
        zIndex: 0,
        borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
        borderColor: state.isFocused ? "#BEECED" : "#BEECED",
        boxShadow: state.isFocused ? null : null,
        "&:hover": {
            borderColor: state.isFocused ? "#1DC2C4" : "#BEECED",
        },
    }),
    singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = "opacity 300ms";

        return { ...provided, opacity, transition };
    },
};

const SemesterSelect = () => {
    const client = useApolloClient();
    const [updateSchedules, setUpdatedSchedules] = useState([
        { label: "Spring 2022", value: 202220 },
    ]);
    let { data: storeData } = useQuery(GET_LOCAL_DATA);
    // Get the term
    let { term } = storeData;
    const { loading, error, data } = useQuery(QUERY_USER_SCHEDULES);
    useEffect(() => {
        let tempSchedules = [];
        if (!loading) {
            console.log(data);
        }
        for (let i = 0; i < data?.scheduleMany.length; i++) {
            let label;
            let value = data?.scheduleMany[i]["term"];
            if (value.substring(4) == "10")
                label = "Fall " + value.substring(0, 4);
            else if (value.substring(4) == "20")
                label = "Spring " + value.substring(0, 4);
            else if (value.substring(4) == "30")
                label = "Summer " + value.substring(0, 4);
            else if (
                value.includes("Spring") ||
                value.includes("Fall") ||
                value.includes("Summer")
            ) {
                label = value;
                if (value.includes("Spring"))
                    value = value.substring(value.indexOf("2")) + "20";
                else if (value.includes("Fall"))
                    value = value.substring(value.indexOf("2")) + "10";
                else if (value.includes("Summer"))
                    value = value.substring(value.indexOf("2")) + "30";
            } else continue;
            tempSchedules.push({ label: label, value: parseInt(value) });
        }

        setUpdatedSchedules(tempSchedules.reverse());
    }, [loading, data, error]);

    const formatTerm = (schedule) =>
        updateSchedules.filter((termOption) => termOption.value == schedule)[0];
    const handleTermChange = (newTermObject) => {
        client.writeQuery({
            query: GET_LOCAL_DATA,
            data: { term: newTermObject.value },
        });
    };

    return (
        <div className="buttonsContainer">
            <div className="select">
                <Select
                    className="react-select-container"
                    value={formatTerm(term)}
                    onChange={handleTermChange}
                    options={updateSchedules}
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            text: "red",
                            primary25: "#BBECED",
                            primary: "#BBECED",
                        },
                    })}
                    styles={customStyles}
                />
            </div>
        </div>
    );
};
export default SemesterSelect;
