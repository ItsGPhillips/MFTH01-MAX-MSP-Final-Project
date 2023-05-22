import styled from "styled-components";
import { RTCConnection } from "../../connection/connection";
import { usePeerConnection } from "../../connection/context";
import { LabeledKnob } from "./effects";

const StyledGlobalEffectsPage = styled.div`
   display: flex;
   justify-content: space-evenly;
   width: 100%;
   height: 100%;
`;

const handleMessage = (connection: RTCConnection, effect: string, value: number) => {
   connection.send({
      type: "global-effect-data",
      effect: effect,
      value: value,
   });
}

export const GlobalEffectsPage: React.FC = () => {
   const connection = usePeerConnection();
   return (
      <StyledGlobalEffectsPage>
         <LabeledKnob
            label="Verb"
            inital={20}
            onValue={(value) => {
               handleMessage(connection, "verb", value);
            }}
         />
         <LabeledKnob
            label="Crunch"
            inital={0}
            onValue={(value) => {
               handleMessage(connection, "crunch", value);
            }}
         />
      </StyledGlobalEffectsPage>
   );
};