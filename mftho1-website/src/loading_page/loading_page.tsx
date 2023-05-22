import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { PerformanceMode, useGlobalStateHooks } from "../state/global_state_context";
import LoadingPage from "./loading_steps";
import { useSpring, animated, config, useSpringRef } from "react-spring";

const MAIN_FONT_NAME: string = "DM Sans";

const MainBody = styled.div``;

const InputPage = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   align-content: center;
   justify-content: center;
   height: 100vh;

   & * {
      font-family: ${MAIN_FONT_NAME}
   }
   & input {
      width: 90%;
      color: #EEEEEE;
      font-size: 3.2rem;
      padding: 1rem 0.3rem;
      user-select: auto;
      background: rgb(19,19,19);
      background: radial-gradient(circle, #1d1e21 80%, #17171a 100%);
      border-color: #545454;
      border-style: solid;
      border-radius: 0.5rem 0.5rem 0rem 0rem;
      text-align: center;

      &:focus {
         outline: none;
      }
   }
`;

const Button = styled.button`
   width: 90%;
   color: #d0d0d0;
   font-size: 2rem;
   padding: 1rem 1em;
   border-color: #545454;
   background: rgb(42,85,179);
   background: radial-gradient(circle,rgba(42,85,179,1) 50%, rgba(25,57,126,1) 100%);
   border-style: solid;
   border-radius: 0rem 0rem 0.5rem 0.5rem;
   
   &.clicked {
   }

   @keyframes clicker {
      from { 
         background: radial-gradient(circle, 
            rgba(42,85,179,1) 0%,
            rgba(73,114,200,1) 0%,
            rgba(25,57,126,1) 100%);
         }
      to { 
         background: radial-gradient(circle, 
            rgba(42,85,179,1) 0%,
            rgba(73,114,200,1) 100%,
            rgba(25,57,126,1) 100%);
      }
   }
`;
const WaitingForConnectionPage: React.FC = () => {
   return (
      <MainBody>
         <LoadingPage />
      </MainBody>
   );
};

export default WaitingForConnectionPage;
