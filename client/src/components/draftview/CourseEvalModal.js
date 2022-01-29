import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import SemesterBox from "../degree/SemesterBox";
import "./CourseEval.css"
import { gql, useQuery, useMutation } from "@apollo/client";
import Paper from '@material-ui/core/Paper';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  BarSeries,
} from '@devexpress/dx-react-chart-material-ui';

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


const CourseEvalModal = (props) => {

  const thisCourse = props.courseSubject + " " + props.courseNum;

  const { loading:evalLoading, error:errorLoading, data:evalData } = useQuery(props.query, {
    variables: { course: thisCourse },
});

  useEffect(() => {
      if (evalData) {
          setEvalDataState(evalData.getEvaluationChartByCourse[0]);
      }
  }, [evalLoading, errorLoading, evalData]);

  const [evalDataState, setEvalDataState] = useState([]);

  const [responseState, setResponseState] = useState(true);

  console.log(evalDataState);

  const openComments = () => {
    setResponseState(false);
  };
  const openResponse = () => {
    setResponseState(true);
  };
    
    return ( 
        <div className="modal-container">
          <h1>{props.courseSubject}&nbsp;{props.courseNum}&nbsp;{props.courseTitle}</h1>
          <h3>Term: {evalDataState.term}</h3>
          <h3>Instructor: {evalDataState.instructor != "" ? evalDataState.instructor : "No Instructor Listed"}
          </h3>
          {responseState ? 
          <div>
          <button className="eval-tabs-clicked" onClick={openResponse}>Numeric Responses</button>
          <button className='eval-tabs' onClick={openComments}>Comments</button>
          
          {/* <Paper>
            <Chart 
              data={evalDataState.expected_pf}>
                <ArgumentAxis />
                  <ValueAxis max={5} />

                  <BarSeries
                    valueField="population"
                    argumentField="year"
                  />
            </Chart>
          </Paper> */}

          </div>
          : 
          <div>
          <button className="eval-tabs" onClick={openResponse}>Numeric Responses</button>
          <button className='eval-tabs-clicked' onClick={openComments}>Comments</button>
          <p>comments</p> 
          </div>
          }
          


        </div>

    );
};
export default CourseEvalModal;
