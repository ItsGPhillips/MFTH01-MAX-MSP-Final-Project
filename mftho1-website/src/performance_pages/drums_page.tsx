import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { usePeerConnection } from '../connection/context';

const StyledBackButton = styled.button`
   width: 10%;
   border-radius: 5px;
   padding: 0.2rem;
   background-color: white;
`;
export const BackButton: React.FC = (props) => {
   const navigate = useNavigate();
   const onclick = () => {
      navigate("/");
   };
   return (
      <StyledBackButton onClick={onclick}>
         <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 26.676 26.676">
            <path d="M26.105,21.891c-0.229,0-0.439-0.131-0.529-0.346l0,0c-0.066-0.156-1.716-3.857-7.885-4.59
               c-1.285-0.156-2.824-0.236-4.693-0.25v4.613c0,0.213-0.115,0.406-0.304,0.508c-0.188,0.098-0.413,0.084-0.588-0.033L0.254,13.815
               C0.094,13.708,0,13.528,0,13.339c0-0.191,0.094-0.365,0.254-0.477l11.857-7.979c0.175-0.121,0.398-0.129,0.588-0.029
               c0.19,0.102,0.303,0.295,0.303,0.502v4.293c2.578,0.336,13.674,2.33,13.674,11.674c0,0.271-0.191,0.508-0.459,0.562
               C26.18,21.891,26.141,21.891,26.105,21.891z"
            />
         </svg>
      </StyledBackButton>
   )
};

const TopPannel: React.FC = (props) => {
   const styles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'stretch',
      justifyContent: 'space-between',
      height: "20%",
   };
   return (
      <div style={styles}>
         <BackButton />
      </div>
   );
};

const StyledDrumPad = styled.button<{color: string}>`
   border-radius: 1rem;
   border: 2px solid black;
   flex: 1;
   background-color: ${(props) => props.color};
   font-size: 2rem;
   font-family: "Helvetica";
`;
interface DrumpadProps {
   name: string,
   color: string,
   message: string,
};

const Drumpad: React.FC<DrumpadProps> = (props) => {
   const connection = usePeerConnection();
   const onclick = () => {
      connection.send({
         type: "drum-hit",
         message: props.message,
      });
   };
   return (
      <StyledDrumPad onClick={onclick} color={props.color}>
         {props.name}
      </ StyledDrumPad>
   );
};

const DrumRow = styled.div`
   display: flex;
   flex-direction: row;
   flex: 1;
`;

const DrumPageContainer = styled.div`
   width: 100vw;
   height: 100vh;
   display: flex;
   flex-direction: column;
`;

export const DrumsPage: React.FC = () => {
   return (
      <DrumPageContainer>
         <TopPannel />
         <DrumRow>
            <Drumpad name="Snare" message="snare" color="#95de81"/>
            <Drumpad name="Tom 1" message="tom-1" color="#ded081"/>
            <Drumpad name="Open Hat" message="o-hat" color="#81b7de"/>
         </DrumRow>
         <DrumRow>
            <Drumpad name="Kick" message="kick" color="#c281de"/>
            <Drumpad name="Tom 2" message="tom-2" color="#deb081"/>
            <Drumpad name="Closed Hat" message="c-hat" color="#8681de"/>
         </DrumRow>
      </DrumPageContainer>
   )
};