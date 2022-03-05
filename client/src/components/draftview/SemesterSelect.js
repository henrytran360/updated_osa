import React, { useState, useEffect } from "react";
import Select from "react-select";
import { gql, useApolloClient, useQuery, useLazyQuery } from "@apollo/client";

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

const VERIFY_TOKEN = gql`
    query VerifyToken {
        verifyToken {
            _id
            firstName
            lastName
            netid
            majors
            college
            affiliation
            token
        }
    }
`;

const customStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            width: 200,
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

const SemesterSelect = () => {
    const client = useApolloClient();
    const [updateSchedules, setUpdatedSchedules] = useState([
        { label: "Spring 2022", value: 202220 },
    ]);
    const [userId, setUserId] = useState("");
    let { data: storeData } = useQuery(GET_LOCAL_DATA);
    // Get the term
    let { term } = storeData;
    const { loading, error, data } = useQuery(QUERY_USER_SCHEDULES);

    useEffect(() => {
        if (data) {
            let tempSchedules = [];
            let tempData = data?.scheduleMany;
            tempData.map((object) => {
                if (object.term.substring(4) == "10")
                    tempSchedules.push({
                        label: "Fall " + object.term.substring(0, 4),
                        value: parseInt(object.term),
                    });
                else if (object.term.substring(4) == "20")
                    tempSchedules.push({
                        label: "Spring " + object.term.substring(0, 4),
                        value: parseInt(object.term),
                    });
                else
                    tempSchedules.push({
                        label: "Summer " + object.term.substring(0, 4),
                        value: parseInt(object.term),
                    });
            });
            setUpdatedSchedules(tempSchedules);
        }
    }, [data]);

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
                            primary25: "var(--border-color)",
                            primary: "var(--border-color)",
                        },
                    })}
                    styles={customStyles}
                />
            </div>
        </div>
    );
};
export default SemesterSelect;
