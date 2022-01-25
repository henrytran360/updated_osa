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
const SemesterSelect = () => {
    const client = useApolloClient();
    const [updateSchedules, setUpdatedSchedules] = useState([]);
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
        setUpdatedSchedules(tempSchedules);
    }, [loading, data, error]);
    console.log("updatedschdules", updateSchedules);
    const formatTerm = (schedule) =>
        updateSchedules.filter((termOption) => termOption.value == schedule)[0];
    const handleTermChange = (newTermObject) =>
        client.writeQuery({
            query: GET_LOCAL_DATA,
            data: { term: newTermObject.value },
        });
    return (
        <div className="buttonsContainer">
            <div className="select">
                <Select
                    value={formatTerm(term)}
                    onChange={handleTermChange}
                    options={updateSchedules}
                />
            </div>
        </div>
    );
};
export default SemesterSelect;
