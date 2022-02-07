import React, { useState, useEffect } from "react";
import Select from "react-select";
import { gql, useApolloClient, useQuery } from "@apollo/client";

const GET_LOCAL_DATA = gql`
    query GetLocalData {
        term @client
        recentUpdate @client
        degreeplanparent @client
        degreeplanname @client
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
        borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
        borderColor: state.isFocused ? "#BEECED" : "#BEECED",
        boxShadow: state.isFocused ? null : null,
        "&:hover": {
            borderColor: state.isFocused ? "#1DC2C4" : "#BEECED",
        },
        width: 200,
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

    let { data: storeData } = useQuery(GET_LOCAL_DATA);
    let { degreeplanparent, degreeplanname } = storeData;
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

    useEffect(() => {
        if (data) {
            const updatedDegreePlanList =
                data.findAllDegreePlansListForUsers.map((plan) => {
                    return {
                        label: plan.name,
                        value: plan._id,
                    };
                });
            client.writeQuery({
                query: GET_LOCAL_DATA,
                data: {
                    degreeplanparent: updatedDegreePlanList[0].value,
                    degreeplanname: updatedDegreePlanList[0].label,
                },
            });
            setDegreePlanList(updatedDegreePlanList);
        }
    }, [data]);

    const formatTerm = (degreePlan) => {
        if (degreePlan) {
            return degreePlanList.filter(
                (termOption) => termOption.value == degreePlan
            )[0];
        } else {
            return degreePlanList[0];
        }
    };
    const handleTermChange = (newTermObject) => {
        client.writeQuery({
            query: GET_LOCAL_DATA,
            data: {
                degreeplanparent: newTermObject.value,
                degreeplanname: newTermObject.label,
            },
        });
    };

    return (
        <div className="buttonsContainer">
            <div className="select">
                <Select
                    className="react-select-container"
                    value={formatTerm(degreeplanparent)}
                    onChange={handleTermChange}
                    options={degreePlanList}
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
export default DegreePlanSelect;
