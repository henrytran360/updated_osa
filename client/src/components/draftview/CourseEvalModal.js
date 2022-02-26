import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import SemesterBox from "../degree/SemesterBox";
import "./CourseEval.css"
import { gql, useQuery, useMutation } from "@apollo/client";
import { IoCloseOutline } from "react-icons/io5";
import { ImWarning } from "react-icons/im";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";



import Chart, {
  ArgumentAxis,
  ValueAxis,
  Series,
  Legend,
  Size,
  Title,
  Font,
  Label,
  Annotation,
  CommonAnnotationSettings,
  Border,
  Shadow,
} from 'devextreme-react/chart';


const CourseEvalModal = (props) => {


  const thisCourse = props.courseSubject + " " + props.courseNum;

  const { loading:evalLoading, error:evalError, data:evalData } = useQuery(props.query, {
    variables: { course: thisCourse },
});

  useEffect(() => {
      if (evalData) {
          setEvalDataState(evalData.getEvaluationChartByCourse[0]);
      }
  }, [evalLoading, evalError, evalData]);

  const [evalDataState, setEvalDataState] = useState([]);

  const [responseState, setResponseState] = useState(true);

  const openComments = () => {
    setResponseState(false);
  };
  const openResponse = () => {
    setResponseState(true);
  };

  const [warningState, setWarningState] = useState(true);

  const closeWarning = () => {
    setWarningState(false);
  }

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

   //Data for term
   const [term, setTerm] = useState("");

  useEffect(() => {
    if (evalDataState) {
      //Get term
      let curTerm = evalDataState.term;
      let term = curTerm ? curTerm : "";
      setTerm(term);

      //Get expected grade data
      let curExpectedGrade = evalDataState.expected_grade;
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

      // get expected grade p/f
      let curExpectedGradePF = evalDataState.expected_pf;
      let expectedGradePFMeanT = curExpectedGradePF ? parseFloat(curExpectedGradePF.class_mean) : 0;
      let expectedGradePFResT = curExpectedGradePF ? parseFloat(curExpectedGradePF.responses) : 0;
      let expectedGradePFArr = [
        { argument: 'P', value: curExpectedGradePF ? parseInt(curExpectedGradePF.score_1) : 0},
        { argument: 'F', value: curExpectedGradePF ? parseInt(curExpectedGradePF.score_2) : 0},
        { argument: 'S', value: curExpectedGradePF ? parseInt(curExpectedGradePF.score_3)  : 0},
        { argument: 'U', value: curExpectedGradePF ? parseInt(curExpectedGradePF.score_4) : 0},
        { argument: 'N/A', value: curExpectedGradePF ? parseInt(curExpectedGradePF.score_5)  : 0}
      ];
      setExpectedGradePF(expectedGradePFArr);
      setExpectedGradePFMean(expectedGradePFMeanT);
      setExpectedGradePFRes(expectedGradePFResT);
      
      //Get class organization data
      let curOrganization = evalDataState.organization;
      let organizationMeanT = curOrganization ? parseFloat(curOrganization.class_mean) : 0;
      let organizationResT = curOrganization ? parseFloat(curOrganization.responses) : 0;
      let organizationArr = [
        { argument: 'Outstanding', value: curOrganization ? parseInt(curOrganization.score_1) : 0},
        { argument: 'Good', value: curOrganization ? parseInt(curOrganization.score_2) : 0},
        { argument: 'Average', value: curOrganization ? parseInt(curOrganization.score_3)  : 0},
        { argument: 'Fair', value: curOrganization ? parseInt(curOrganization.score_4) : 0},
        { argument: 'Poor', value: curOrganization ? parseInt(curOrganization.score_5)  : 0}
      ];
      setOrganization(organizationArr); 
      setOrganizationMean(organizationMeanT);
      setOrganizationRes(organizationResT);

      //Get class assignments data
      let curAssignments = evalDataState.assignments;
      let assignmentsMeanT = curAssignments ? parseFloat(curAssignments.class_mean) : 0;
      let assignmentsResT = curAssignments ? parseFloat(curAssignments.responses) : 0;
      let assignmentsArr = [
        { argument: 'Outstanding', value: curAssignments ? parseInt(curAssignments.score_1) : 0},
        { argument: 'Good', value: curAssignments ? parseInt(curAssignments.score_2) : 0},
        { argument: 'Average', value: curAssignments ? parseInt(curAssignments.score_3)  : 0},
        { argument: 'Fair', value: curAssignments ? parseInt(curAssignments.score_4) : 0},
        { argument: 'Poor', value: curAssignments ? parseInt(curAssignments.score_5)  : 0}
      ];
      setAssignments(assignmentsArr); 
      setAssignmentsMean(assignmentsMeanT);
      setAssignmentsRes(assignmentsResT);

      //Get class quality data
      let curQuality = evalDataState.overall;
      let qualityMeanT = curQuality ? parseFloat(curQuality.class_mean) : 0;
      let qualityResT = curQuality ? parseFloat(curQuality.responses) : 0;
      let qualityArr = [
        { argument: 'Outstanding', value: curQuality ? parseInt(curQuality.score_1) : 0},
        { argument: 'Good', value: curQuality ? parseInt(curQuality.score_2) : 0},
        { argument: 'Average', value: curQuality ? parseInt(curQuality.score_3)  : 0},
        { argument: 'Fair', value: curQuality ? parseInt(curQuality.score_4) : 0},
        { argument: 'Poor', value: curQuality ? parseInt(curQuality.score_5)  : 0}
      ];
      setQuality(qualityArr); 
      setQualityMean(qualityMeanT);
      setQualityRes(qualityResT);

      //Get class challenge data
      let curChallege = evalDataState.challenge;
      let challengeMeanT = curChallege ? parseFloat(curChallege.class_mean) : 0;
      let challengeResT = curChallege ? parseFloat(curChallege.responses) : 0;
      let challengeArr = [
        { argument: 'Strongly Agree', value: curChallege ? parseInt(curChallege.score_1) : 0},
        { argument: 'Agree', value: curChallege ? parseInt(curChallege.score_2) : 0},
        { argument: 'Neutral', value: curChallege ? parseInt(curChallege.score_3)  : 0},
        { argument: 'Disagree', value: curChallege ? parseInt(curChallege.score_4) : 0},
        { argument: 'Strongly Disagree', value: curChallege ? parseInt(curChallege.score_5)  : 0}
      ];
      setChallenge(challengeArr); 
      setChallengeMean(challengeMeanT);
      setChallengeRes(challengeResT);

      //Get class workload data
      let curWorkload = evalDataState.workload;
      let workloadMeanT = curWorkload ? parseFloat(curWorkload.class_mean) : 0;
      let workloadResT = curWorkload ? parseFloat(curWorkload.responses) : 0;
      let workloadArr = [
        { argument: 'Much Lighter', value: curWorkload ? parseInt(curWorkload.score_1) : 0},
        { argument: 'Somewhat Lighter', value: curWorkload ? parseInt(curWorkload.score_2) : 0},
        { argument: 'Average', value: curWorkload ? parseInt(curWorkload.score_3)  : 0},
        { argument: 'Somewhat Heavier', value: curWorkload ? parseInt(curWorkload.score_4) : 0},
        { argument: 'Much Heavier', value: curWorkload ? parseInt(curWorkload.score_5)  : 0}
      ];
      setWorkload(workloadArr); 
      setWorkloadMean(workloadMeanT);
      setWorkloadRes(workloadResT);

      //Get class why taking data
      let curWhyTaking = evalDataState.why_taking;
      let whyTakingMeanT = curWhyTaking ? parseFloat(curWhyTaking.class_mean) : 0;
      let whyTakingResT = curWhyTaking ? parseFloat(curWhyTaking.responses) : 0;
      let whyTakingArr = [
        { argument: 'Univ or Dist Req', value: curWhyTaking ? parseInt(curWhyTaking.score_1) : 0},
        { argument: 'Req for Major', value: curWhyTaking ? parseInt(curWhyTaking.score_2) : 0},
        { argument: 'Elective in Major', value: curWhyTaking ? parseInt(curWhyTaking.score_3)  : 0},
        { argument: 'Free Elective', value: curWhyTaking ? parseInt(curWhyTaking.score_4) : 0},
        { argument: 'N/A', value: curWhyTaking ? parseInt(curWhyTaking.score_5)  : 0}
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
    

  const customizeText = (arg) => {
    return `${arg.valueText}%`;
  }    

    return ( 
        <div className="modal-container">
          { warningState ? 
          <div className="eval-warning">
              <div className="warning-icon">
                <ImWarning color="#e9d50d" size={40}/>
              </div>
              <p className="warning-text">These evaluations are intended to be available only to Rice students, faculty and staff on its internal 
              computer network. This information is considered confidential and is to be used solely by, within and amongst 
              the Rice University community and its members.</p>
            <div className="exit-warning">
              <IconButton
                disableFocusRipple
                disableRipple
                style={{ 
                  backgroundColor: "transparent",
                  padding:"0",
                  margin:"0"
                }}
                onClick={closeWarning}
            >
                <IoCloseOutline color="#898e91" size={30}/>
            </IconButton>
            </div>
          </div> : <></>
          }
          <div className="course-info">
          <div className="course-eval-header">
          <h1 className="no-padding-no-margin">
            <span className="course-num">{props.courseSubject}&nbsp;{props.courseNum}</span>
            <span className="course-title">&nbsp;{props.courseTitle}</span>
          </h1>
          </div>
          <p className="course-details">Term: {term}</p>
          <p className="course-details">Instructor: {props.courseProf ? props.courseProf &&
                          props.courseProf.firstName +
                              " " +
                              props.courseProf.lastName
                        : "No Instructors"}
          </p>
          
            <div className="eval-tabs">
                <button className={`${responseState ? "eval-tabs-clicked" : "eval-tabs-unclicked"}`} onClick={openResponse}>Numeric Responses</button>
                <button className={`${responseState ? "eval-tabs-unclicked" : "eval-tabs-clicked"}`} onClick={openComments}>Comments</button>
            </div>
            
          </div>
          {responseState ? 
          <div className="chart-padding">
            <div className="header-border"/>
            <div className="charts-display">
              <div className="chart-container">
              <p className="chart-txt">Class Mean:&nbsp;{expectedGradeMean}&nbsp;&nbsp;
              Rice Mean: 1.34
              <br/>Responses:&nbsp;{expectedGradeRes}</p>
              <Chart 
                dataSource={expectedGrade}
                height={"100px"}
              >
              <CommonAnnotationSettings
                type="text"
                series="Value"
                allowDragging={false}
                color={"transparent"}

              >
              </CommonAnnotationSettings>
              {expectedGrade.filter((data)=>{
                return data.value > 0;
              }).map((data) => (
                <Annotation
                  argument={data.argument}
                  key={data.argument}
                  text={data.value}
                  color={"transparent"}
                  arrowLength={0}
                >
                  <Font 
                  size="17px"
                  color={"#338182"}
                  family={"Acari Sans"}
                  />
                  <Border visible={false}/>
                  <Shadow opacity={0}/>
                </Annotation>

              ))}
                <Series 
                  type="bar"
                  hoverMode="none"
                  valueField="value"
                  argumentField="argument"
                  color={"#1DC2C4"}
                  name="Value"
                />
                <Title 
                  text="Expected Grade (Letter)" 
                >
                  <Font 
                  size="15px"
                  color={"#165859"}
                  family={"Acari Sans"}
                  />
                </Title>

                <ArgumentAxis>
                  <Label>
                  <Font 
                    size="15px"
                    color={"#338182"}
                    family={"Acari Sans"}
                    />
                  </Label>  
                </ArgumentAxis>

                <ValueAxis
                    visualRange={[0,100]}
                    visible={false}
                >
                <Label customizeText={customizeText} >
                <Font 
                  size="15px"
                  color={"#338182"}
                  family={"Acari Sans"}
                  />
                </Label>
                </ValueAxis>
                <Legend visible={false} />
                <Size
                          height={270}
                          width={335}
                      />
              </Chart> 
              </div>
              <div className="chart-container">
              <p className="chart-txt">Class Mean:&nbsp;{expectedGradePFMean}&nbsp;&nbsp;
              Rice Mean: 1.59
              <br/>Responses:&nbsp;{expectedGradePFRes}</p>              
              <Chart 
                dataSource={expectedGradePF}
                height={"100px"}
              >
              <CommonAnnotationSettings
                type="text"
                series="Value"
                allowDragging={false}
                color={"transparent"}

              >
              </CommonAnnotationSettings>
              {expectedGradePF.filter((data)=>{
                return data.value > 0;
              }).map((data) => (
                <Annotation
                  argument={data.argument}
                  key={data.argument}
                  text={data.value}
                  color={"transparent"}
                  arrowLength={0}
                >
                  <Font 
                  size="17px"
                  color={"#338182"}
                  family={"Acari Sans"}
                  />
                  <Border visible={false}/>
                  <Shadow opacity={0}/>
                </Annotation>

              ))}
                <Series 
                  type="bar"
                  hoverMode="none"
                  valueField="value"
                  argumentField="argument"
                  color={"#1DC2C4"}
                  name="Value"
                />
                <Title 
                  text="Expected Grade (P/F)" 
                >
                  <Font 
                  size="15px"
                  color={"#165859"}
                  family={"Acari Sans"}
                  />
                </Title>

                <ArgumentAxis>
                  <Label>
                  <Font 
                    size="15px"
                    color={"#338182"}
                    family={"Acari Sans"}
                    />
                  </Label>  
                </ArgumentAxis>

                <ValueAxis
                    visualRange={[0,100]}
                    visible={false}
                >
                <Label customizeText={customizeText} >
                <Font 
                  size="15px"
                  color={"#338182"}
                  family={"Acari Sans"}
                  />
                </Label>
                </ValueAxis>
                <Legend visible={false} />
                <Size
                          height={270}
                          width={335}
                      />
              </Chart> 
              </div>
              <div className="chart-container">
              <p className="chart-txt">Class Mean:&nbsp;{organizationMean}&nbsp;&nbsp;
              Rice Mean: 1.73
              <br/>Responses:&nbsp;{organizationRes}</p>     
              <Chart 
                dataSource={organization}
                height={"100px"}
              >
              <CommonAnnotationSettings
                type="text"
                series="Value"
                allowDragging={false}
                color={"transparent"}

              >
              </CommonAnnotationSettings>
              {organization.filter((data)=>{
                return data.value > 0;
              }).map((data) => (
                <Annotation
                  argument={data.argument}
                  key={data.argument}
                  text={data.value}
                  color={"transparent"}
                  arrowLength={0}
                >
                  <Font 
                  size="17px"
                  color={"#338182"}
                  family={"Acari Sans"}
                  />
                  <Border visible={false}/>
                  <Shadow opacity={0}/>
                </Annotation>

              ))}
                <Series 
                  type="bar"
                  hoverMode="none"
                  valueField="value"
                  argumentField="argument"
                  color={"#1DC2C4"}
                  name="Value"
                />
                <Title 
                  text="Organization: The organization of this course was:" 
                >         
                  <Font 
                  size="15px"
                  color={"#165859"}
                  family={"Acari Sans"}
                  />
                </Title>

                <ArgumentAxis>
                  <Label>
                  <Font 
                    size="12px"
                    color={"#338182"}
                    family={"Acari Sans"}
                    />
                  </Label>  
                </ArgumentAxis>

                <ValueAxis
                    visualRange={[0,100]}
                    visible={false}
                >
                <Label customizeText={customizeText} >
                <Font 
                  size="15px"
                  color={"#338182"}
                  family={"Acari Sans"}
                  />
                </Label>
                </ValueAxis>
                <Legend visible={false} />
                <Size
                          height={270}
                          width={335}
                      />
              </Chart> 
              </div>
              <div className="chart-container">
              <p className="chart-txt">Class Mean:&nbsp;{assignmentsMean}&nbsp;&nbsp;
              Rice Mean: 1.75
              <br/>Responses:&nbsp;{assignmentsRes}</p>                   
              <Chart 
                dataSource={assignments}
                height={"100px"}
              >
              <CommonAnnotationSettings
                type="text"
                series="Value"
                allowDragging={false}
                color={"transparent"}

              >
              </CommonAnnotationSettings>
              {assignments.filter((data)=>{
                return data.value > 0;
              }).map((data) => (
                <Annotation
                  argument={data.argument}
                  key={data.argument}
                  text={data.value}
                  color={"transparent"}
                  arrowLength={0}
                >
                  <Font 
                  size="17px"
                  color={"#338182"}
                  family={"Acari Sans"}
                  />
                  <Border visible={false}/>
                  <Shadow opacity={0}/>
                </Annotation>

              ))}
                <Series 
                  type="bar"
                  hoverMode="none"
                  valueField="value"
                  argumentField="argument"
                  color={"#1DC2C4"}
                  name="Value"
                />
                <Title 
                  text="Assignments: The contribution that the graded work made to the learning experience was:" 
                >           
                  <Font 
                  size="15px"
                  color={"#165859"}
                  family={"Acari Sans"}
                  />
                </Title>

                <ArgumentAxis>
                  <Label>
                  <Font 
                    size="12px"
                    color={"#338182"}
                    family={"Acari Sans"}
                    />
                  </Label>  
                </ArgumentAxis>

                <ValueAxis
                    visualRange={[0,100]}
                    visible={false}
                >
                <Label customizeText={customizeText} >
                <Font 
                  size="15px"
                  color={"#338182"}
                  family={"Acari Sans"}
                  />
                </Label>
                </ValueAxis>
                <Legend visible={false} />
                <Size
                          height={270}
                          width={335}
                      />
              </Chart> 
              </div>
              <div className="chart-container">
              <p className="chart-txt">Class Mean:&nbsp;{qualityMean}&nbsp;&nbsp;
              Rice Mean: 1.75
              <br/>Responses:&nbsp;{qualityRes}</p>               
              <Chart 
                dataSource={quality}
                height={"100px"}
              >
              <CommonAnnotationSettings
                type="text"
                series="Value"
                allowDragging={false}
                color={"transparent"}

              >
              </CommonAnnotationSettings>
              {quality.filter((data)=>{
                return data.value > 0;
              }).map((data) => (
                <Annotation
                  argument={data.argument}
                  key={data.argument}
                  text={data.value}
                  color={"transparent"}
                  arrowLength={0}
                >
                  <Font 
                  size="17px"
                  color={"#338182"}
                  family={"Acari Sans"}
                  />
                  <Border visible={false}/>
                  <Shadow opacity={0}/>
                </Annotation>

              ))}
                <Series 
                  type="bar"
                  hoverMode="none"
                  valueField="value"
                  argumentField="argument"
                  color={"#1DC2C4"}
                  name="Value"
                />
                <Title 
                  text="Overall, I would rate the quality of this course as:" 
                >
                  <Font 
                  size="15px"
                  color={"#165859"}
                  family={"Acari Sans"}
                  />
                </Title>

                <ArgumentAxis>
                  <Label>
                  <Font 
                    size="12px"
                    color={"#338182"}
                    family={"Acari Sans"}
                    />
                  </Label>  
                </ArgumentAxis>

                <ValueAxis
                    visualRange={[0,100]}
                    visible={false}
                >
                <Label customizeText={customizeText} >
                <Font 
                  size="15px"
                  color={"#338182"}
                  family={"Acari Sans"}
                  />
                </Label>
                </ValueAxis>
                <Legend visible={false} />
                <Size
                          height={270}
                          width={335}
                      />
              </Chart> 
              </div>
              <div className="chart-container">
              <p className="chart-txt">Class Mean:&nbsp;{challengeMean}&nbsp;&nbsp;
              Rice Mean: 1.73
              <br/>Responses:&nbsp;{challengeRes}</p>      
              <Chart 
                dataSource={challenge}
                height={"100px"}
              >
              <CommonAnnotationSettings
                type="text"
                series="Value"
                allowDragging={false}
                color={"transparent"}

              >
              </CommonAnnotationSettings>
              {challenge.filter((data)=>{
                return data.value > 0;
              }).map((data) => (
                <Annotation
                  argument={data.argument}
                  key={data.argument}
                  text={data.value}
                  color={"transparent"}
                  arrowLength={0}
                >
                  <Font 
                  size="17px"
                  color={"#338182"}
                  family={"Acari Sans"}
                  />
                  <Border visible={false}/>
                  <Shadow opacity={0}/>
                </Annotation>

              ))}
                <Series 
                  type="bar"
                  hoverMode="none"
                  valueField="value"
                  argumentField="argument"
                  color={"#1DC2C4"}
                  name="Value"
                />
                <Title 
                  text="Challenge: I was challenged to extend my capabilities or to develop new ones:" 
                >        
                  <Font 
                  size="15px"
                  color={"#165859"}
                  family={"Acari Sans"}
                  />
                </Title>

                <ArgumentAxis>
                  <Label>
                  <Font 
                    size="11px"
                    color={"#338182"}
                    family={"Acari Sans"}
                    />
                  </Label>  
                </ArgumentAxis>

                <ValueAxis
                    visualRange={[0,100]}
                    visible={false}
                >
                <Label customizeText={customizeText} >
                <Font 
                  size="15px"
                  color={"#338182"}
                  family={"Acari Sans"}
                  />
                </Label>
                </ValueAxis>
                <Legend visible={false} />
                <Size
                          height={270}
                          width={335}
                      />
              </Chart> 
              </div>
              <div className="chart-container">
              <p className="chart-txt">Class Mean:&nbsp;{whyTakingMean}&nbsp;&nbsp;
              Rice Mean: 2.18
              <br/>Responses:&nbsp;{whyTakingRes}</p>        
              <Chart 
                dataSource={whyTaking}
                height={"100px"}
              >
              <CommonAnnotationSettings
                type="text"
                series="Value"
                allowDragging={false}
                color={"transparent"}

              >
              </CommonAnnotationSettings>
              {whyTaking.filter((data)=>{
                return data.value > 0;
              }).map((data) => (
                <Annotation
                  argument={data.argument}
                  key={data.argument}
                  text={data.value}
                  color={"transparent"}
                  arrowLength={0}
                >
                  <Font 
                  size="17px"
                  color={"#338182"}
                  family={"Acari Sans"}
                  />
                  <Border visible={false}/>
                  <Shadow opacity={0}/>
                </Annotation>

              ))}
                <Series 
                  type="bar"
                  hoverMode="none"
                  valueField="value"
                  argumentField="argument"
                  color={"#1DC2C4"}
                  name="Value"
                />
                <Title 
                  text="I am taking this course because it satisfies:" 
                >      
                  <Font 
                  size="15px"
                  color={"#165859"}
                  family={"Acari Sans"}
                  />
                </Title>

                <ArgumentAxis>
                  <Label>
                  <Font 
                    size="12px"
                    color={"#338182"}
                    family={"Acari Sans"}
                    />
                  </Label>  
                </ArgumentAxis>

                <ValueAxis
                    visualRange={[0,100]}
                    visible={false}
                >
                <Label customizeText={customizeText} >
                <Font 
                  size="15px"
                  color={"#338182"}
                  family={"Acari Sans"}
                  />
                </Label>
                </ValueAxis>
                <Legend visible={false} />
                <Size
                          height={270}
                          width={335}
                      />
              </Chart>   
              </div>
              <div className="chart-container">
              <p className="chart-txt">Class Mean:&nbsp;{workloadMean}&nbsp;&nbsp;
              Rice Mean: 2.78
              <br/>Responses:&nbsp;{workloadRes}</p>    
              <Chart 
                dataSource={workload}
                height={"100px"}
              >
              <CommonAnnotationSettings
                type="text"
                series="Value"
                allowDragging={false}
                color={"transparent"}

              >
              </CommonAnnotationSettings>
              {workload.filter((data)=>{
                return data.value > 0;
              }).map((data) => (
                <Annotation
                  argument={data.argument}
                  key={data.argument}
                  text={data.value}
                  color={"transparent"}
                  arrowLength={0}
                >
                  <Font 
                  size="17px"
                  color={"#338182"}
                  family={"Acari Sans"}
                  />
                  <Border visible={false}/>
                  <Shadow opacity={0}/>
                </Annotation>

              ))}
                <Series 
                  type="bar"
                  hoverMode="none"
                  valueField="value"
                  argumentField="argument"
                  color={"#1DC2C4"}
                  name="Value"
                />
                <Title 
                  text="Workload: The workload for this course compared to others at Rice was:" 
                >          
                  <Font 
                  size="15px"
                  color={"#165859"}
                  family={"Acari Sans"}
                  />
                </Title>

                <ArgumentAxis>
                  <Label>
                  <Font 
                    size="10.5px"
                    color={"#338182"}
                    family={"Acari Sans"}
                    />
                  </Label>  
                </ArgumentAxis>

                <ValueAxis
                    visualRange={[0,100]}
                    visible={false}
                >
                <Label customizeText={customizeText} >
                <Font 
                  size="15px"
                  color={"#338182"}
                  family={"Acari Sans"}
                  />
                </Label>
                </ValueAxis>
                <Legend visible={false} />
                <Size
                          height={270}
                          width={335}
                      />
              </Chart> 
              </div>
            </div>


          </div>
          : 
          <div>            
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
