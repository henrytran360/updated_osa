import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import SemesterBox from "../degree/SemesterBox";
import "./CourseEval.css"
import { gql, useQuery, useMutation } from "@apollo/client";

// Query
// const GET_EVALUATION_BY_COURSE = gql`
//     query getEvaluationByCourse($course: String!) {
//         getEvaluationByCourse(course: $course) {
//             course
//             evalInfo {
//                 Term
//                 CRN
//                 Reviews
//                 title
//                 Instructor
//                 Department
//                 yearID
//             }
//         }
//     }
// `;

const GET_EVALUATION_CHART_BY_COURSE = gql
`query getEvaluationChartByCourse($course: String!){
    getEvaluationChartByCourse(course: $course){
    	courseName
    	expected_pf{
        score_1
        score_2
        score_3
        score_4
        score_5
      }
    	expected_grade{
        score_1
        score_2
        score_3
        score_4
        score_5
      }
    	comments{
        text
        time
      }
    	term
    	enrolled_amount
    
  }
}`

const CourseEvalModal = (props) => {

  const thisCourse = props.courseSubject + " " + props.courseNum;

  const { loading:evalLoading, error:errorLoading, data:evalData } = useQuery(props.query, {
    variables: { course: "COMP 140" },
});

  console.log(evalData);

  useEffect(() => {
      if (evalData) {
          setEvalDataState(evalData.getEvaluationChartByCourse);
      }
  }, [evalLoading, errorLoading, evalData]);

  const [evalDataState, setEvalDataState] = useState([]);
  //console.log(evalDataState);

  const [responseState, setResponseState] = useState(true);

  const openComments = () => {
    setResponseState(false);
  };
  const openResponse = () => {
    setResponseState(true);
  };
    
    return ( 
        <div className="modal-container">
          <h1>{props.courseSubject}&nbsp;{props.courseNum}&nbsp;{props.courseTitle}</h1>
          <h3>Term:</h3>
          <h3>Instructor:</h3>

          <button className='modal-tabs' onClick={openResponse}>Numeric Responses</button>
          <button onClick={openComments}>Comments</button>
          {responseState ? <p>response</p> : <p>comments</p> }


        </div>

    );
};
export default CourseEvalModal;
