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
  Title
} from '@devexpress/dx-react-chart-material-ui';
import { ValueScale, ArgumentScale } from '@devexpress/dx-react-chart';


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

  //console.log(evalDataState);

  const openComments = () => {
    setResponseState(false);
  };
  const openResponse = () => {
    setResponseState(true);
  };

  const [expectedGrade, setExpectedGrade] = useState([]);
  const [expectedGradeMean, setExpectedGradeMean] = useState(0.0);
  const [expectedGradeRes, setExpectedGradeRes] = useState(0.0);
  useEffect(() => {
    if (evalDataState) {
      let curExpectedGrade = evalDataState.expected_grade
      let expectedGradeMeanT = curExpectedGrade ? parseFloat(curExpectedGrade.class_mean) : 0;
      let expectedGradeResT = curExpectedGrade ? parseFloat(curExpectedGrade.responses) : 0;
      let expectedGradeArr = [
        { argument: 'A', value: curExpectedGrade ? parseInt(curExpectedGrade.score_1) : 0},
        { argument: 'B', value: curExpectedGrade ? parseInt(curExpectedGrade.score_2) : 0},
        { argument: 'C', value: curExpectedGrade ? parseInt(curExpectedGrade.score_3)  : 0},
        { argument: 'D', value: curExpectedGrade ? parseInt(curExpectedGrade.score_4) : 0},
        { argument: 'F', value: curExpectedGrade ? parseInt(curExpectedGrade.score_5)  : 0}
      ];
      setExpectedGrade(expectedGradeArr);
      setExpectedGradeMean(expectedGradeMeanT);
      setExpectedGradeRes(expectedGradeResT);

    }
}, [evalDataState, evalData]);
    
    const [state, setState] = useState({});
    const setChartRange = () => setState({chart_visualRange: [0, 100]} );
    
    return ( 
        <div className="modal-container">
          <h1>{props.courseSubject}&nbsp;{props.courseNum}&nbsp;{props.courseTitle}</h1>
          <h3>Term: {evalDataState.term}</h3>
          <h3>Instructor: {props.courseProf ? props.courseProf &&
                          props.courseProf.firstName +
                              " " +
                              props.courseProf.lastName
                        : "No Instructors"}
          </h3>
          {responseState ? 
          <div>
          <button className="eval-tabs-clicked" onClick={openResponse}>Numeric Responses</button>
          <button className='eval-tabs' onClick={openComments}>Comments</button>
          
        <p>Responses:&nbsp;{expectedGradeRes}&nbsp;&nbsp;Class Mean:&nbsp;{expectedGradeMean}</p>
          
          <Paper>
          <Chart
              data={expectedGrade}
            >
              {/* <ValueScale factory={{
                range: () => [0, 100],
                domain: () => [0, 100]
              }}/> */}
              <ArgumentAxis />
              <ValueAxis 
                type = {'continuous'}
                visualRange = {state.chart_visualRange}
              
                />

              <Title text="Expected Grade" />
              <BarSeries valueField="value" argumentField="argument" />
            </Chart>
          </Paper>


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
