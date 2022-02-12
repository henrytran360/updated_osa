import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import SemesterBox from "../degree/SemesterBox";
import "./CourseEval.css"
import { gql, useQuery, useMutation } from "@apollo/client";

import Chart, {
  ArgumentAxis,
  ValueAxis,
  Series,
  Legend,
  Size,
  Title,
  Font
} from 'devextreme-react/chart';


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

  //Data for Expected Grade
  const [expectedGrade, setExpectedGrade] = useState([]);
  const [expectedGradeMean, setExpectedGradeMean] = useState(0.0);
  const [expectedGradeRes, setExpectedGradeRes] = useState(0.0);

  //Data for Class Organization
  const [organization, setOrganization] = useState([]);
  const [organizationMean, setOrganizationMean] = useState(0.0);
  const [organizationRes, setOrganizationRes] = useState(0.0);

  //Data for class Assignments
  const [assignments, setAssignments] = useState([]);
  const [assignmentsMean, setAssignmentsMean] = useState(0.0);
  const [assignmentsRes, setAssignmentsRes] = useState(0.0);

  //Data for course quality
  const [quality, setQuality] = useState([]);
  const [qualityMean, setQualityMean] = useState(0.0);
  const [qualityRes, setQualityRes] = useState(0.0);

  //Data for course challenge
  const [challenge, setChallenge] = useState([]);
  const [challengeMean, setChallengeMean] = useState(0.0);
  const [challengeRes, setChallengeRes] = useState(0.0);

  //Data for course workload
  const [workload, setWorkload] = useState([]);
  const [workloadMean, setWorkloadMean] = useState(0.0);
  const [workloadRes, setWorkloadRes] = useState(0.0);

  //Data for why taking
  const [whyTaking, setWhyTaking] = useState([]);
  const [whyTakingMean, setWhyTakingMean] = useState(0.0);
  const [whyTakingRes, setWhyTakingRes] = useState(0.0);

  //Data for expected Grade PF
  const [expectedGradePF, setExpectedGradePF] = useState([]);
  const [expectedGradePFMean, setExpectedGradePFMean] = useState(0.0);
  const [expectedGradePFRes, setExpectedGradePFRes] = useState(0.0);

   //Data for class comments
   const [comments, setComments] = useState([]);



  useEffect(() => {
    if (evalDataState) {
      //Get expected grade data
      let curExpectedGrade = evalDataState.expected_grade;
      let expectedGradeMeanT = curExpectedGrade ? parseFloat(curExpectedGrade.class_mean) : 0;
      let expectedGradeResT = curExpectedGrade ? parseFloat(curExpectedGrade.responses) : 0;
      let expectedGradeArr = [
        { argument: '1\nA', value: curExpectedGrade ? parseInt(curExpectedGrade.score_1) : 0},
        { argument: '2\nB', value: curExpectedGrade ? parseInt(curExpectedGrade.score_2) : 0},
        { argument: '3\nC', value: curExpectedGrade ? parseInt(curExpectedGrade.score_3)  : 0},
        { argument: '4\nD', value: curExpectedGrade ? parseInt(curExpectedGrade.score_4) : 0},
        { argument: '5\nF', value: curExpectedGrade ? parseInt(curExpectedGrade.score_5)  : 0}
      ];
      setExpectedGrade(expectedGradeArr);
      setExpectedGradeMean(expectedGradeMeanT);
      setExpectedGradeRes(expectedGradeResT);

      // get expected grade p/f
      let curExpectedGradePF = evalDataState.expected_pf;
      let expectedGradePFMeanT = curExpectedGradePF ? parseFloat(curExpectedGradePF.class_mean) : 0;
      let expectedGradePFResT = curExpectedGradePF ? parseFloat(curExpectedGradePF.responses) : 0;
      let expectedGradePFArr = [
        { argument: '1\nP', value: curExpectedGradePF ? parseInt(curExpectedGradePF.score_1) : 0},
        { argument: '2\nF', value: curExpectedGradePF ? parseInt(curExpectedGradePF.score_2) : 0},
        { argument: '3\nS', value: curExpectedGradePF ? parseInt(curExpectedGradePF.score_3)  : 0},
        { argument: '4\nU', value: curExpectedGradePF ? parseInt(curExpectedGradePF.score_4) : 0},
        { argument: '5\nN/A', value: curExpectedGradePF ? parseInt(curExpectedGradePF.score_5)  : 0}
      ];
      setExpectedGradePF(expectedGradePFArr);
      setExpectedGradePFMean(expectedGradePFMeanT);
      setExpectedGradePFRes(expectedGradePFResT);
      
      //Get class organization data
      let curOrganization = evalDataState.organization;
      let organizationMeanT = curOrganization ? parseFloat(curOrganization.class_mean) : 0;
      let organizationResT = curOrganization ? parseFloat(curOrganization.responses) : 0;
      let organizationArr = [
        { argument: '1\nOutstanding', value: curOrganization ? parseInt(curOrganization.score_1) : 0},
        { argument: '2\nGood', value: curOrganization ? parseInt(curOrganization.score_2) : 0},
        { argument: '3\nAverage', value: curOrganization ? parseInt(curOrganization.score_3)  : 0},
        { argument: '4\nFair', value: curOrganization ? parseInt(curOrganization.score_4) : 0},
        { argument: '5\nPoor', value: curOrganization ? parseInt(curOrganization.score_5)  : 0}
      ];
      setOrganization(organizationArr); 
      setOrganizationMean(organizationMeanT);
      setOrganizationRes(organizationResT);

      //Get class assignments data
      let curAssignments = evalDataState.assignments;
      let assignmentsMeanT = curAssignments ? parseFloat(curAssignments.class_mean) : 0;
      let assignmentsResT = curAssignments ? parseFloat(curAssignments.responses) : 0;
      let assignmentsArr = [
        { argument: '1\nOutstanding', value: curAssignments ? parseInt(curAssignments.score_1) : 0},
        { argument: '2\nGood', value: curAssignments ? parseInt(curAssignments.score_2) : 0},
        { argument: '3\nAverage', value: curAssignments ? parseInt(curAssignments.score_3)  : 0},
        { argument: '4\nFair', value: curAssignments ? parseInt(curAssignments.score_4) : 0},
        { argument: '5\nPoor', value: curAssignments ? parseInt(curAssignments.score_5)  : 0}
      ];
      setAssignments(assignmentsArr); 
      setAssignmentsMean(assignmentsMeanT);
      setAssignmentsRes(assignmentsResT);

      //Get class quality data
      let curQuality = evalDataState.overall;
      let qualityMeanT = curQuality ? parseFloat(curQuality.class_mean) : 0;
      let qualityResT = curQuality ? parseFloat(curQuality.responses) : 0;
      let qualityArr = [
        { argument: '1\nOutstanding', value: curQuality ? parseInt(curQuality.score_1) : 0},
        { argument: '2\nGood', value: curQuality ? parseInt(curQuality.score_2) : 0},
        { argument: '3\nAverage', value: curQuality ? parseInt(curQuality.score_3)  : 0},
        { argument: '4\nFair', value: curQuality ? parseInt(curQuality.score_4) : 0},
        { argument: '5\nPoor', value: curQuality ? parseInt(curQuality.score_5)  : 0}
      ];
      setQuality(qualityArr); 
      setQualityMean(qualityMeanT);
      setQualityRes(qualityResT);

      //Get class challenge data
      let curChallege = evalDataState.challenge;
      let challengeMeanT = curChallege ? parseFloat(curChallege.class_mean) : 0;
      let challengeResT = curChallege ? parseFloat(curChallege.responses) : 0;
      let challengeArr = [
        { argument: '1\nStrongly Agree', value: curChallege ? parseInt(curChallege.score_1) : 0},
        { argument: '2\nAgree', value: curChallege ? parseInt(curChallege.score_2) : 0},
        { argument: '3\nNeutral', value: curChallege ? parseInt(curChallege.score_3)  : 0},
        { argument: '4\nDisagree', value: curChallege ? parseInt(curChallege.score_4) : 0},
        { argument: '5\nStrongly Disagree', value: curChallege ? parseInt(curChallege.score_5)  : 0}
      ];
      setChallenge(challengeArr); 
      setChallengeMean(challengeMeanT);
      setChallengeRes(challengeResT);

      //Get class workload data
      let curWorkload = evalDataState.workload;
      let workloadMeanT = curWorkload ? parseFloat(curWorkload.class_mean) : 0;
      let workloadResT = curWorkload ? parseFloat(curWorkload.responses) : 0;
      let workloadArr = [
        { argument: '1\nMuch Lighter', value: curWorkload ? parseInt(curWorkload.score_1) : 0},
        { argument: '2\nSomewhat Lighter', value: curWorkload ? parseInt(curWorkload.score_2) : 0},
        { argument: '3\nAverage', value: curWorkload ? parseInt(curWorkload.score_3)  : 0},
        { argument: '4\nSomewhat Heavier', value: curWorkload ? parseInt(curWorkload.score_4) : 0},
        { argument: '5\nMuch Heavier', value: curWorkload ? parseInt(curWorkload.score_5)  : 0}
      ];
      setWorkload(workloadArr); 
      setWorkloadMean(workloadMeanT);
      setWorkloadRes(workloadResT);

      //Get class why taking data
      let curWhyTaking = evalDataState.why_taking;
      let whyTakingMeanT = curWhyTaking ? parseFloat(curWhyTaking.class_mean) : 0;
      let whyTakingResT = curWhyTaking ? parseFloat(curWhyTaking.responses) : 0;
      let whyTakingArr = [
        { argument: '1\nUniv or Dist Req', value: curWhyTaking ? parseInt(curWhyTaking.score_1) : 0},
        { argument: '2\nReq for Major', value: curWhyTaking ? parseInt(curWhyTaking.score_2) : 0},
        { argument: '3\nElective in Major', value: curWhyTaking ? parseInt(curWhyTaking.score_3)  : 0},
        { argument: '4\nFree Elective', value: curWhyTaking ? parseInt(curWhyTaking.score_4) : 0},
        { argument: '5\nN/A', value: curWhyTaking ? parseInt(curWhyTaking.score_5)  : 0}
      ];
      setWhyTaking(whyTakingArr); 
      setWhyTakingMean(whyTakingMeanT);
      setWhyTakingRes(whyTakingResT);

      //Get class comments
      let curComments = evalDataState.comments;
      let commentsArr = curComments ? curComments : [];

      setComments(commentsArr);


    }
}, [evalDataState, evalData]);
    

    
    return ( 
        <div className="modal-container">
          <div className="course-info">
          <h1>{props.courseSubject}&nbsp;{props.courseNum}&nbsp;{props.courseTitle}</h1>
          <h3>Term: {evalDataState.term}</h3>
          <h3>Instructor: {props.courseProf ? props.courseProf &&
                          props.courseProf.firstName +
                              " " +
                              props.courseProf.lastName
                        : "No Instructors"}
          </h3>
          </div>
          {responseState ? 
          <div>
            <div className="eval-tabs">
              <button className="eval-tabs-clicked" onClick={openResponse}>Numeric Responses</button>
              <button className="eval-tabs-unclicked" onClick={openComments}>Comments</button>
            </div>
            <div className="charts-display">
              <div className="chart-container">
              <p>Responses:&nbsp;{expectedGradeRes}&nbsp;&nbsp;Class Mean:&nbsp;{expectedGradeMean}</p>
              <Chart 
                dataSource={expectedGrade}
                height={"100px"}
              >
                <Series 
                  type="bar"
                  valueField="value"
                  argumentField="argument"
                />
                <Title 
                  text="Expected Grade (Letter)" 
                >
                  <Font size="20px"/>
                </Title>

                <ArgumentAxis
                    //tickInterval={10}
                />
                <ValueAxis
                    visualRange={[0,100]}
                    title="Percent"
                />
                <Legend visible={false} />
                <Size
                          height={250}
                          width={335}
                      />
              </Chart> 
              </div>
              <div className="chart-container">
              <p>Responses:&nbsp;{expectedGradePFRes}&nbsp;&nbsp;Class Mean:&nbsp;{expectedGradePFMean}</p>
              <Chart 
                dataSource={expectedGradePF}
                height={"100px"}
              >
                <Series 
                  type="bar"
                  valueField="value"
                  argumentField="argument"
                />
                <Title 
                  text="Expected Grade (P/F)" 
                >
                  <Font size="20px"/>
                </Title>

                <ArgumentAxis
                    //tickInterval={10}
                />
                <ValueAxis
                    visualRange={[0,100]}
                    title="Percent"
                />
                <Legend visible={false} />
                <Size
                          height={250}
                          width={335}
                      />
              </Chart>  
              </div>
              <div className="chart-container">
              <p>Responses:&nbsp;{organizationRes}&nbsp;&nbsp;Class Mean:&nbsp;{organizationMean}</p>
              <Chart 
                dataSource={organization}
                height={"100px"}
              >
                <Series 
                  type="bar"
                  valueField="value"
                  argumentField="argument"
                />
                <Title 
                  text="Class Organization" 
                >
                  <Font size="20px"/>
                </Title>

                <ArgumentAxis
                    //tickInterval={10}
                />
                <ValueAxis
                    visualRange={[0,100]}
                    title="Percent"
                />
                <Legend visible={false} />
                <Size
                          height={250}
                          width={335}
                      />
              </Chart>  
              </div>
              <div className="chart-container">
              <p>Responses:&nbsp;{assignmentsRes}&nbsp;&nbsp;Class Mean:&nbsp;{assignmentsMean}</p>
              <Chart 
                dataSource={assignments}
                height={"100px"}
              >
                <Series 
                  type="bar"
                  valueField="value"
                  argumentField="argument"
                />
                <Title 
                  text="Contribution of Assignments" 
                >
                  <Font size="20px"/>
                </Title>

                <ArgumentAxis
                    //tickInterval={10}
                />
                <ValueAxis
                    visualRange={[0,100]}
                    title="Percent"
                />
                <Legend visible={false} />
                <Size
                          height={250}
                          width={335}
                      />
              </Chart>  
              </div>
              <div className="chart-container">
              <p>Responses:&nbsp;{qualityRes}&nbsp;&nbsp;Class Mean:&nbsp;{qualityMean}</p>
              <Chart 
                dataSource={quality}
                height={"100px"}
              >
                <Series 
                  type="bar"
                  valueField="value"
                  argumentField="argument"
                />
                <Title 
                  text="Overall Quality" 
                >
                  <Font size="20px"/>
                </Title>

                <ArgumentAxis
                    //tickInterval={10}
                />
                <ValueAxis
                    visualRange={[0,100]}
                    title="Percent"
                />
                <Legend visible={false} />
                <Size
                          height={250}
                          width={335}
                      />
              </Chart>  
              </div>
              <div className="chart-container">
              <p>Responses:&nbsp;{challengeRes}&nbsp;&nbsp;Class Mean:&nbsp;{challengeMean}</p>
              <Chart 
                dataSource={challenge}
                height={"100px"}
              >
                <Series 
                  type="bar"
                  valueField="value"
                  argumentField="argument"
                />
                <Title 
                  text="I was challenged" 
                >
                  <Font size="20px"/>
                </Title>

                <ArgumentAxis
                    //tickInterval={10}
                />
                <ValueAxis
                    visualRange={[0,100]}
                    title="Percent"
                />
                <Legend visible={false} />
                <Size
                          height={250}
                          width={335}
                      />
              </Chart>  
              </div>
              <div className="chart-container">
              <p>Responses:&nbsp;{whyTakingRes}&nbsp;&nbsp;Class Mean:&nbsp;{whyTakingMean}</p>
              <Chart 
                dataSource={whyTaking}
                height={"100px"}
              >
                <Series 
                  type="bar"
                  valueField="value"
                  argumentField="argument"
                />
                <Title 
                  text="I am taking this course because" 
                >
                  <Font size="20px"/>
                </Title>

                <ArgumentAxis
                    //tickInterval={10}
                />
                <ValueAxis
                    visualRange={[0,100]}
                    title="Percent"
                />
                <Legend visible={false} />
                <Size
                          height={250}
                          width={335}
                      />
              </Chart>  
              </div>
              <div className="chart-container">
              <p>Responses:&nbsp;{workloadRes}&nbsp;&nbsp;Class Mean:&nbsp;{workloadMean}</p>
              <Chart 
                dataSource={workload}
                height={"100px"}
              >
                <Series 
                  type="bar"
                  valueField="value"
                  argumentField="argument"
                />
                <Title 
                  text="The workload was" 
                >
                  <Font size="20px"/>
                </Title>

                <ArgumentAxis
                    //tickInterval={10}
                />
                <ValueAxis
                    visualRange={[0,100]}
                    title="Percent"
                />
                <Legend visible={false} />
                <Size
                          height={250}
                          width={335}
                      />
              </Chart>  
              </div>
            </div>


          </div>
          : 
          <div>
            <div className="eval-tabs">
              <button className="eval-tabs-unclicked" onClick={openResponse}>Numeric Responses</button>
              <button className="eval-tabs-clicked" onClick={openComments}>Comments</button>
            </div>
            
            {
            comments.map((item, index) => {
                return(
                    <div className={`comment-container ${index % 2 == 0 ? "comment-even" : ""}`} key={index}>
                    <div>{item.text}</div>
                    <div className="time-stamp">{item.time}</div>
                    </div>
                );
            })
           }
          


          </div>
          }
          


        </div>

    );
};
export default CourseEvalModal;
