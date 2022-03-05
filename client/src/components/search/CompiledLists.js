import React from "react";
import CourseList from "./CourseList";
import SwipeableViews from "react-swipeable-views";
import "./CompiledLists.global.css";

const styles = {
    slideContainer: {
        height: 500,
        WebkitOverflowScrolling: "touch", // iOS momentum scrolling
    },
    slideContainerNoHeight: {
        WebkitOverflowScrolling: "touch", // iOS momentum scrolling
        height: "100%",
    },
};

// Create an array with all of the necessary search values of the selected options
const getValues = (selectedOptions, searchKey, queryFilters) => {
    let selectedValues = [];
    if (selectedOptions) {
        // for each selected option, create a new object and get query filter values
        for (let i = 0; i < selectedOptions.length; i++) {
            let option = {};
            // for each query filter, store appropriate value with the corresponding search key
            for (let j = 0; j < queryFilters.length; j++) {
                option[searchKey[j]] = selectedOptions[i][queryFilters[j]];
            }
            selectedValues.push(option);
        }
    }
    return selectedValues;
};

// The selected days should be stored in an array for the query variable i.e. {days:["M", "W", "F"]} and therefore
// are converted differently than the other search options
const displayDaysCourseList = (
    scheduleID,
    query,
    selectedOptions,
    convertDays,
    idx,
    getByName
) => {
    if (selectedOptions && selectedOptions.length) {
        let daysArray = convertDays(selectedOptions);

        let searchType = { days: daysArray };
        return (
            <SwipeableViews containerStyle={styles.slideContainerNoHeight}>
                <div className="courseListsContainer">
                    <CourseList
                        scheduleID={scheduleID}
                        query={query}
                        searchType={searchType}
                        key={idx}
                        idx={idx}
                        getByName={getByName}
                    />
                </div>
            </SwipeableViews>
        );
    }
    // This is to ensure that the search result section will always show up even though there's nothing yet
    return (
        <SwipeableViews containerStyle={styles.slideContainerNoHeight}>
            <div></div>
        </SwipeableViews>
    );
};

const displayNameSearchCourseList = (
    scheduleID,
    query,
    idx,
    getByName,
    courseName
) => {
    if (courseName) {
        let searchType = { inputName: courseName };
        return (
            <SwipeableViews containerStyle={styles.slideContainerNoHeight}>
                <div className="courseListsContainer">
                    <CourseList
                        scheduleID={scheduleID}
                        query={query}
                        searchType={searchType}
                        key={idx}
                        idx={idx}
                        getByName={getByName}
                    />
                </div>
            </SwipeableViews>
        );
    }
    // This is to ensure that the search result section will always show up even though there's nothing yet
    return (
        <SwipeableViews containerStyle={styles.slideContainerNoHeight}>
            <div></div>
        </SwipeableViews>
    );
};

const CompiledLists = ({
    scheduleID,
    getByName,
    selectedOptions,
    searchKey,
    query,
    queryFilters,
    convertDays,
    idx,
    courseName,
}) => {
    // If the search option is by days, we need to convert the query variables to an array i.e. {days: ["M", "W", "F"]}
    if (idx === 4) {
        return displayDaysCourseList(
            scheduleID,
            query,
            selectedOptions,
            convertDays,
            idx,
            getByName
        );
    }
    if (idx === 5) {
        return displayNameSearchCourseList(
            scheduleID,
            query,
            idx,
            getByName,
            courseName
        );
    }

    let optionValues = getValues(selectedOptions, searchKey, queryFilters);

    return (
        <SwipeableViews containerStyle={styles.slideContainerNoHeight}>
            <div className="courseListsContainer">
                {
                    // return a CourseList for each of the selected options
                    optionValues.map((option) => {
                        let searchType = {};
                        for (let key of searchKey) {
                            searchType[key] = option[key];
                        }
                        return (
                            <CourseList
                                scheduleID={scheduleID}
                                query={query}
                                searchType={searchType}
                                key={option[searchKey[0]]}
                                idx={idx}
                                getByName={getByName}
                            />
                        );
                    })
                }
            </div>
        </SwipeableViews>
    );
};

export default CompiledLists;
