import React, { useState, useEffect } from "react";
import Select from "react-select";
import { gql, useApolloClient, useQuery } from "@apollo/client";

const GET_LOCAL_DATA = gql`
    query GetLocalData {
        term @client
        recentUpdate @client
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

const QUERY_USER_DEGREE_PLAN_LIST = gql`
    query QUERY_ALL_USER_DEGREE_PLANS_LIST($_id: ID!) {
        findAllDegreePlansListForUsers(_id: $_id) {
            _id
            name
            user {
                firstName
            }
        }
    }
`;

const customStyles = {
    option: (provided, state) => ({
        ...provided,
        // borderBottom: "1px dotted pink",
        color: "#1DC2C4",
    }),
    control: (base, state) => ({
        ...base,
        color: "#1DC2C4",
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

const DegreePlanSelect = () => {
    const client = useApolloClient();
    const [userId, setUserId] = useState("");
    const [degreePlanList, setDegreePlanList] = useState([]);

    const { loading, error, data } = useQuery(QUERY_USER_DEGREE_PLAN_LIST, {
        variables: {
            _id: userId,
        },
    });
    const {
        loading: loading4,
        error: error4,
        data: data4,
    } = useQuery(VERIFY_TOKEN);

    useEffect(() => {
        if (data4) {
            setUserId(data4.verifyToken._id);
        }
    }, [loading4, data4, error4]);

    console.log(data);

    // const [updateSchedules, setUpdatedSchedules] = useState([
    //     { label: "Spring 2022", value: 202220 },
    // ]);

    // const formatTerm = (schedule) =>
    //     updateSchedules.filter((termOption) => termOption.value == schedule)[0];
    // const handleTermChange = (newTermObject) => {
    //     client.writeQuery({
    //         query: GET_LOCAL_DATA,
    //         data: { term: newTermObject.value },
    //     });
    // };

    return (
        <div className="buttonsContainer">
            {/* <div className="select">
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
            </div> */}
        </div>
    );
};
export default DegreePlanSelect;
