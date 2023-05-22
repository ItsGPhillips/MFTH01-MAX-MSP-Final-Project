import styled from "styled-components";
import { RTCConnection } from "../../connection/connection";
import { usePeerConnection } from "../../connection/context";
import { LabeledKnob } from "./effects";

const StyledDrumsEffectsPage = styled.div`
   display: flex;
   justify-content: space-evenly;
   width: 100%;
   height: 100%;
`;

const handleMessage = (connection: RTCConnection, effect: string, value: number) => {
   connection.send({
      type: "drum-effect-data",
      effect: effect,
      value: value,
   });
}


export const DrumEffectsPage: React.FC = () => {
   const connection = usePeerConnection();
   return (
      <StyledDrumsEffectsPage>
         <LabeledKnob
            label="Echo"
            inital={50}
            onValue={(value) => {
               handleMessage(connection, "echo", value);
            }}
         />
         <LabeledKnob
            label="Phasor"
            inital={0}
            onValue={(value) => {
               handleMessage(connection, "phasor", value);
            }}
         />
      </StyledDrumsEffectsPage>
   );
};