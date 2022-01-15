import React from "react";
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


export const GET_EVALUATION_CHART_BY_COURSE = gql`
query getEvaluationChartByCourse($course: String!){
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
}
`;

const CourseEvalModal = (props) => {
    // const { loading3, error3, data3 } = useQuery(
    //     GET_EVALUATION_CHART_BY_COURSE
    // );


    const modalRef = useRef();
    const closeModal = e => {
        if (modalRef.current === e.target) {
          props.setShowModal(false);
        }
      };
    
    return ( 
        <>
        {props.showModal ? (
          <Background onClick={closeModal} ref={modalRef}>
              <ModalWrapper showModal={props.showModal}>
                <ModalContent>
                  <h1>modal</h1>
                </ModalContent>
                <button
                  aria-label='Close modal'
                  onClick={() => props.setShowModal(prev => !prev)}
                >close</button>
              </ModalWrapper>
          </Background>
        ) : null}
      </>
    );
};
export default CourseEvalModal;
