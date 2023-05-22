import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { animated, useTransition } from "react-spring";
import { PerformanceMode, useGlobalStateHooks } from "../state/global_state_context";

const MAIN_FONT_NAME: string = "DM Sans";

interface StepData {
   title: string,
   complete_title: string,
}

interface StageWrapperProps {
   data: StepData
   idx: number,
   active: number,
}

const LoadingSpinner = styled.div`
   width: 2rem;
   height: 2rem;
   margin: 0.8rem;
   border-radius: 50%;
   border-color: #2a55b3;
   border-style: solid;
   border-top-color: #799ae2;
   animation: spinner 1s ease-in-out infinite;

   @keyframes spinner {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
   }
`;
const InactiveSpinner = styled.div`
   width: 1.2rem;
   height: 1.2rem;
   margin: 0.8rem;
   border-radius: 50%;
   border-color: #676a72;
   border-style: solid;
`;
const CompletedSpinner = styled.div`
   width: 1.2rem;
   height: 1.2rem;
   margin: 0.8rem;
   border-radius: 50%;
   background: #51d64a;
`;

const StageWrapperDiv = styled(animated.div)`
   display: flex;
   flex-direction: row;
   align-items: center;
   margin-left: 10%;
   margin-right: 10%;
   padding: 0.6rem;
   
   & h3 {
      font-size: 1.6rem;
      line-height: 1rem;
      color: #D2D4C8;
      font-weight: 400;
      font-family: ${MAIN_FONT_NAME};
   }
   & .active {
      font-size: 2.2rem;
      line-height: 2.8rem;
      transition: 0.2s ease-in-ou;
   }
   & .complete {
      font-size: 1.4rem;
      line-height: 2rem;
      transition: 0.2s ease-in-out;
   }
   & .inactive {
      font-size: 1rem;
      line-height: 2rem;
      transition: 0.2s ease-in-out;
   }
`;

const StageWrapper: React.FC<StageWrapperProps> = (props) => {
   const [is_visible, setIsVisible] = useState(false);
   const transition = useTransition(is_visible, {
      from: { x: "-10rem", opacity: 0 },
      enter: { x: "0rem", opacity: 1 },
   });

   useEffect(() => {
      setTimeout(() => setIsVisible(true), (props.idx * 80));
   }, [props]);

   const LoadingSpinnerComposite: React.FC<{ status: string }> = (props) => {
      switch (props.status) {
         case "active": return <LoadingSpinner />;
         case "inactive": return <InactiveSpinner />;
         case "complete": return <CompletedSpinner />;
         default: throw new Error("Invalid Spinner status");
      }
   };

   const getStatus = () => {
      if (props.active < props.idx) return "inactive";
      if (props.active > props.idx) return "complete";
      return "active";
   }

   const Label = () => {
      switch (getStatus()) {
         case "active": return <h3 className={"active"}>{props.data.title}</h3>;
         case "inactive": return <h3 className={"inactive"}>{props.data.title}</h3>;
         case "complete": return <h3 className={"complete"}>{props.data.complete_title}</h3>;
         default: throw new Error("Invalid Spinner status");
      }
   };

   return (
      <div>
         {transition((style, item) => {
            return item ?
               <StageWrapperDiv style={style}>
                  <LoadingSpinnerComposite status={getStatus()} />
                  {Label()}
               </StageWrapperDiv> : null;
         })}
      </div>
   )
}

const LoadingPageWapperDiv = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: center;
   height: 100vh;
`;


//  "piano-mode" : "xy-pad-mode"
const LoadingPage: React.FC = () => {
   const [active_stage, setActiveStage] = useState(0);
   // const { roleHook: [, setPerformanceMode] } = useGlobalStateHooks();

   useEffect(() => {
      const successfulConnectionCB = (e: Event) => {
         setActiveStage(1);
         window.dispatchEvent(new Event(`performance-ready`));
      };
      // const setRoleImpl = (value: string) => {
      //    setActiveStage(2);
      //    setTimeout(() => {
      //       switch(value) {
      //          // case "Piano Mode": setPerformanceMode("piano-mode"); return;
      //          // case "XY Controller": setPerformanceMode("xy-pad-mode"); return;
      //       }
      //    }, 1200);
      // }
      // const setRolePianoModeCB = (e: Event) => setRoleImpl("Piano Mode");
      // const setRoleXYCModeCB = (e: Event) => setRoleImpl("XY Controller");

      window.addEventListener("peer-connected", successfulConnectionCB);
      // window.addEventListener("set-role-piano-mode", setRolePianoModeCB);
      // window.addEventListener("set-role-xy-pad-mode", setRoleXYCModeCB);
      return () => {
         window.removeEventListener("peer-connected",successfulConnectionCB);
         // window.removeEventListener("set-role-piano-mode", setRolePianoModeCB);
         // window.removeEventListener("set-role-xy-pad-mode", setRoleXYCModeCB);
      }
   }, []);

   const steps: StepData[] = [
      {
         title: "Waiting For Connection",
         complete_title: "Connected!",
      },
      // {
      //    title: "Waiting for role",
      //    complete_title: `Received Role: ${active_role}`,
      // },
   ];

   return (
      <LoadingPageWapperDiv>
         {
            steps.map((step, idx) => {
               return (
                  <StageWrapper
                     key={idx} // <-- items are never added or removed so this should be gucci??
                     idx={idx}
                     data={step}
                     active={active_stage}
                  />
               )
            })
         }
      </LoadingPageWapperDiv>
   )
}

export default LoadingPage;