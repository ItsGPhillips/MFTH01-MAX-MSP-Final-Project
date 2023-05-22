import 'react-piano/dist/styles.css';
//@ts-ignore
import { Piano, MidiNumbers } from 'react-piano';
import React, { useContext, useRef, useState } from 'react';
import useSize from "@react-hook/size";
import Button from '@material-ui/core/Button'
import { IconContext } from 'react-icons';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import styled from 'styled-components';
import { usePeerConnection } from '../connection/context';
import { useNavigate } from 'react-router-dom';

const PianoFontName: string = 'DM Sans';

interface OctaveButtonProps {
   type: 'octave-down' | 'octave-up'
   onClick: () => void,
};

const OctaveButton: React.FC<OctaveButtonProps> = (props: OctaveButtonProps) => {
   const styles: React.CSSProperties = {
      width: "20%",
      backgroundColor: "#247BA0",
   };
   const TextField = styled.span({
      fontSize: "2em",
      fontFamily: PianoFontName,
   });
   return (
      <IconContext.Provider value={{ color: '#E2E2E2', size: '3.5rem' }}>
         <Button style={styles} variant='outlined' onClick={props.onClick}>
            {props.type === 'octave-down' ?
               <>
                  <FaCaretLeft />
                  <TextField>-12</TextField>
               </> :
               <>
                  <TextField>+12</TextField>
                  <FaCaretRight />
               </>}
         </Button>
      </IconContext.Provider>
   );
};

const StyledBackButton = styled.button`
   width: 10%;
   border-radius: 5px;
   padding: 0.2rem;
   background-color: white;
`;
const BackButton: React.FC = (props) => {
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
}

const TopPannel: React.FC = (props) => {
   const context = useContext(MidiStateContext);
   if (!context) {
      throw new Error("Context was null");
   }
   const { firstNote, setFirstNote } = context;

   const styles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'stretch',
      justifyContent: 'space-between',
      height: "20%",
   };

   const calcFirstNotePlusOctave = () => {
      const maxMidiNote = 127 - 12;
      setFirstNote(Math.min(firstNote + 12, maxMidiNote));
   };
   const calcFirstNoteMinusctave = () => {
      setFirstNote(Math.max(firstNote - 12, 12));
   };

   return (
      <div style={styles}>
         <OctaveButton type='octave-down' onClick={calcFirstNoteMinusctave} />
         <BackButton />
         <OctaveButton type='octave-up' onClick={calcFirstNotePlusOctave} />
      </div>
   );
};
const MidiNumberLabel = styled.span({
   fontSize: "2em",
   fontWeight: 600,
   fontFamily: PianoFontName,
});
const MidiPiano: React.FC = () => {
   const connection = usePeerConnection();
   const context = useContext(MidiStateContext);
   if (!context) {
      throw new Error("Context was null");
   }
   const { firstNote } = context;

   const target = useRef(null);
   const [piano_width, piano_height] = useSize(target);

   const styles: React.CSSProperties = {
      padding: "0px",
      border: "0px",
      userSelect: 'none',
      height: "70%"
   }

   interface RenderNoteLabelArgs {
      midiNumber: number,
      isActive: boolean,
      isAccidental: boolean,
   };

   interface MidiNumberMeta {
      note: string
      pitchName: string,
      octave: number,
      midiNumber: number,
      isAccidental: boolean,
   }

   const getMidiNumberMeta = (midi_num: number): MidiNumberMeta => {
      return MidiNumbers.getAttributes(midi_num);
   };

   const isFirstNote = (midi_number: number): boolean => {
      return firstNote === midi_number;
   };
   return (
      <div style={styles} ref={target}>
         <Piano
            noteRange={{ first: firstNote, last: firstNote + 12 }}
            playNote={(midi_number: any) => {
               console.assert(typeof midi_number === 'number')
               connection.send({
                  type: 'midi-note-down',
                  midi_number,
               })
            }}
            stopNote={(midi_number: any) => {
               console.assert(typeof midi_number === 'number')
               connection.send({
                  type: 'midi-note-up',
                  midi_number,
               })
            }}
            width={piano_width}
            height={piano_height}
            renderNoteLabel={({ midiNumber }: RenderNoteLabelArgs) => {
               if (isFirstNote(midiNumber)) {
                  return (
                     <MidiNumberLabel>
                        {getMidiNumberMeta(midiNumber).note}
                     </MidiNumberLabel>
                  );
               };
            }}
         />
      </div>
   );
};
interface MidiState {
   firstNote: number,
   setFirstNote: React.Dispatch<React.SetStateAction<number>>
}
const MidiStateContext = React.createContext<MidiState | null>(null);
const MidiStateProvider: React.FC = (props) => {
   const [firstNote, setFirstNote] = useState(60); // Middle C
   return (
      <MidiStateContext.Provider value={{
         firstNote, setFirstNote
      }}>
         {props.children}
      </MidiStateContext.Provider>
   )
};
const MidiPianoPage: React.FC = () => {
   const styles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      width: "100%",
      height: "100%",
   }
   return (
      <div style={styles}>
         <MidiStateProvider>
            <TopPannel />
            <MidiPiano />
         </MidiStateProvider>
      </div>
   );
};


export default MidiPianoPage;