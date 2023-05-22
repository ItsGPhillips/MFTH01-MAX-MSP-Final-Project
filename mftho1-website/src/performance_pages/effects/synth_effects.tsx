import styled from "styled-components";
import { RTCConnection } from "../../connection/connection";
import { usePeerConnection } from '../../connection/context';
import { LabeledKnob } from "./effects";

const StyledSynthEffectsPage = styled.div`
   display: flex;
   justify-content: space-evenly;
   width: 100%;
   height: 100%;
`;

const handleMessage = (connection: RTCConnection, effect: string, value: number) => {
   connection.send({
      type: "synth-effect-data",
      effect: effect,
      value: value,
   });
}

export const SynthEffectsPage: React.FC = () => {
   const connection = usePeerConnection();
   return (
      <StyledSynthEffectsPage>
         <LabeledKnob
            label="Filter"
            inital={100}
            onValue={(value) => {
               handleMessage(connection, "filter", value);
            }}
         />
         <LabeledKnob
            label="LFO"
            inital={0}
            onValue={(value) => {
               handleMessage(connection, "lfo", value);
            }}
         />
      </StyledSynthEffectsPage>
   );
};