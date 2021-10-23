import React, { Fragment } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import SwipeableViews from "react-swipeable-views";

import DraftCourseItem from "./DraftCourseItem";
import { CircularProgress, TableBody } from "@material-ui/core";

import "./ClassSelector.global.css";
import { gql, useMutation, useQuery } from "@apollo/client";

const useStyles = makeStyles({
    table: {
        width: "100%",
    },
});

const styles = {
    slideContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxHeight: "50vh",
        maxWidth: "1600px",
        overflow: "inherit",
        // WebkitOverflowScrolling: "touch", // iOS momentum scrolling
    },
    slide: {
        position: "sticky",
        top: 0,
    },
};

// Styled rows
const StyledTableHeader = withStyles((theme) => ({
    root: {
        backgroundColor: "#FFFFFF",
        borderRadius: "15px",
        border: "0px",
        opacity: 1,
    },
}))(TableRow);

const StyledTableRow = withStyles((theme) => ({
    root: {
        backgroundColor: "#F7FAFC",
        borderRadius: "15px",
        opacity: 1,
    },
}))(TableRow);

const StyledHeaderTableCell = withStyles((theme) => ({
    root: {
        color: "#697E99",
        backgroundColor: "#FFFFFF",
        border: "0px",
    },
}))(TableCell);

/**
 * GraphQL Queries
 */

/**
 * Fetch the previous term's courses
 */
const GET_PREVIOUS_TERM_COURSES = gql`
    query GetPreviousTermCourses($term: Int!) {
        prevTermCourses(term: $term)
    }
`;

/**
 * Fetch the instructors along with their webIds
 */
const FETCH_INSTRUCTORS = gql`
    query WebIDs($termcode: String!) {
        instructorList(termcode: $termcode) {
            firstName
            lastName
            webId
        }
    }
`;

/**
 * This simply fetches from our cache whether a recent update has occurred
 * TODO: CREATE FRAGMENTS / PLACE TO STORE ALL OF THESE SINCE THIS ONE IS ALSO IN ROUTES.JS
 */
const GET_LOCAL_DATA = gql`
    query GetLocalData {
        term @client
        recentUpdate @client
    }
`;

const ClassSelector = ({ draftSessions, scheduleID }) => {
    const classes = useStyles();

    // Get the current term
    const {
        data: { term },
    } = useQuery(GET_LOCAL_DATA);

    /**
     * Get last semester's courses for the purposes of course evaluations
     */
    const {
        data: prevTermCourses,
        loading,
    } = useQuery(GET_PREVIOUS_TERM_COURSES, { variables: { term: term } });

    const { data: instructorsList } = useQuery(FETCH_INSTRUCTORS, {
        variables: { termcode: String(term) },
    });

    // Get headers
    const headers = {
        Visible: false,
        "Course Code": true,
        CRN: true,
        Credits: true,
        Distribution: true,
        "Class Times": true,
        "Lab Times": true,
        "Instructor(s)": true,
        Remove: false,
    };

    // Ensure that all sessions in a user's draft sessions are still valid; otherwise, filter them out
    draftSessions = draftSessions.filter(draft => draft.session);

    // Calculate total credit hours visible
    let visibleCreditTotal = draftSessions.reduce(
        (totalCredits, draftSession) => {
            if (draftSession.visible) {
                return totalCredits + draftSession.session.course.creditsMin;
            } else {
                return totalCredits;
            }
        },
        0
    );

    // Calculate absolute total credit hours
    let absoluteCreditTotal = draftSessions.reduce(
        (totalCredits, draftSession) => {
            return totalCredits + draftSession.session.course.creditsMin;
        },
        0
    );

    return (
        <Fragment>
            <div className="tableRowContainer">
                <div className="tableHeader">
                    {Object.keys(headers).map((headerKey) => (
                        <p>{headers[headerKey] ? headerKey : null}</p>
                    ))}
                </div>
                {loading
                    ? <div className="loadingMessage"><CircularProgress color="inherit" /></div>
                    : draftSessions.map((draftSession, idx) => (
                          <DraftCourseItem
                              //replace key with uuid
                              key={idx}
                              visible={draftSession.visible}
                              session={draftSession.session}
                              course={draftSession.session.course}
                              prevTermCourses={prevTermCourses.prevTermCourses}
                              instructorsList={instructorsList}
                              scheduleID={scheduleID}
                          />
                      ))}
                <div className="tableFooter">
                    Visible Credit Hours: {visibleCreditTotal}
                    <hr />
                    Total Credit Hours: {absoluteCreditTotal}
                </div>
            </div>
        </Fragment>
    );

    return (
        <TableContainer>
            <SwipeableViews containerStyle={styles.slideContainer}>
                <Table
                    stickyHeader={true}
                    //commented out cause there was a warning?
                    //stickyFooter={true}
                    className={classes.table}
                    aria-label="simple table"
                >
                    <TableHead>
                        <StyledTableHeader>
                            {headers.map((heading, idx) => {
                                if (idx == 0) {
                                    return (
                                        <StyledHeaderTableCell
                                            //replace key with uuid
                                            key={idx}
                                        ></StyledHeaderTableCell>
                                    );
                                } else {
                                    return (
                                        <StyledHeaderTableCell
                                            align="right"
                                            //replace key with uuid
                                            key={idx}
                                        >
                                            {heading}
                                        </StyledHeaderTableCell>
                                    );
                                }
                            })}
                        </StyledTableHeader>
                    </TableHead>
                    {draftSessions.map((draftSession, idx) => (
                        <DraftCourseItem
                            //replace key with uuid
                            key={idx}
                            visible={draftSession.visible}
                            session={draftSession.session}
                            course={draftSession.session.course}
                            scheduleID={scheduleID}
                        />
                    ))}
                </Table>
            </SwipeableViews>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell align="left">
                            Total Visible Hours: {visibleCreditTotal}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ClassSelector;
