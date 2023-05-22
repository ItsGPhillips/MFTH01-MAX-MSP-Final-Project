import React, { createContext, useContext } from "react";
import { useState } from "react";
import styled from "styled-components";
import { SynthEffectsPage } from './synth_effects';
import { DrumEffectsPage } from './drum_effects';
import { GlobalEffectsPage } from './global_effects';
import { BackButton } from "../drums_page";
import { Donut } from "react-dial-knob";

const ActiveTabContext = createContext(1);
const SetActiveTabContext = createContext<React.Dispatch<React.SetStateAction<number>> | null>(null);
const useActiveTabIndex = () => {
   return useContext(ActiveTabContext);
}
export const useSetActiveTab = () => {
   const ctx = useContext(SetActiveTabContext)
   if (!ctx) {
      throw new Error("SetActiveTabContext was null. Make sure SetActiveTabContext is set");
   }
   return ctx;
};
export const ActiveTabContextProvider = (props: React.PropsWithChildren<{}>) => {
   const [active_tab, set_active_tab] = useState(0);
   return (
      <ActiveTabContext.Provider value={active_tab}>
         <SetActiveTabContext.Provider value={set_active_tab}>
            {props.children}
         </SetActiveTabContext.Provider>
      </ActiveTabContext.Provider>
   );
};

const StyledKnobLabel = styled.div`
   text-align: center;
   font-size: 2rem; 
   padding: 1rem;
`;
const StyledLabeledKnob = styled.div`
   padding: 2rem;
`;
export interface LabeledKnobProps {
   label: string,
   inital: number,
   onValue: (value: number) => void
};
export const LabeledKnob: React.FC<LabeledKnobProps> = (props) => {
   const [value, setValue] = useState(props.inital);
   return (
      <StyledLabeledKnob>
         <Donut
            diameter={120}
            min={0}
            max={100}
            step={1}
            value={value}
            theme={{
               donutColor: '#3fa990',
               bgrColor: "#7d8983",
               maxedBgrColor: "red",
               donutThickness: 8,
            }}
            onValueChange={(n) => { setValue(n); props.onValue(n); }}
         />
         <StyledKnobLabel>{props.label}</StyledKnobLabel>
      </StyledLabeledKnob>
   );
};

// ButtonBar =======================================================================

const StyledTabButton = styled.div<{ is_active: boolean }>`
   height: 100%;
   width: 100%;
   flex: 1;
   text-align: center;
   background-color: ${props => {
      return props.is_active ? `#b1e47b` : `#9e9e9e`;
   }};
   border: 2px solid black;
`;
interface TabButtonProps {
   index: number,
   title: string,
   element?: React.ReactNode,
}
const TabButton: React.FC<TabButtonProps> = (props) => {
   const setActiveTab = useSetActiveTab();
   const is_active = useActiveTabIndex() === props.index;
   const element = (props.element) ? props.element : props.title;
   return (
      <StyledTabButton is_active={is_active} onClick={() => { setActiveTab(props.index) }}>
         {element}
      </StyledTabButton>
   );
}

const StyledButtonBar = styled.div`
   height: 20%;
   width: 100%;
   display: flex;
   flex-direction: row;
   align-items: stretch;
`;
const ButtonBar: React.FC = (props) => {
   return (
      <StyledButtonBar>
         {props.children}
      </StyledButtonBar>
   );
}

// Pages =======================================================================
const StyledTabPage = styled.div`
   width: 100%;
   height: 100%;
`;
interface TabPageProps {
   index: number,
   element: React.ReactElement
}
const TabPage: React.FC<TabPageProps> = (props) => {
   return (
      <StyledTabPage>
         {props.element}
      </StyledTabPage>
   );
};

interface TabPagesProps {
   children: React.ReactElement<TabPagesProps>[]
}
const StyledTabPages = styled.div`
   display: flex;
   flex: 1;
   color: white;
`;
const TabPages: React.FC<TabPagesProps> = (props) => {
   const active_page = React.Children.toArray(props.children)[useActiveTabIndex()];
   return (<StyledTabPages>{active_page ? active_page : "No Content"}</StyledTabPages>);
};
const StyledTabsArea = styled.div`
   display: flex;
   flex-direction: column;
   width: 100%;
   height: 100%;
`;
interface TabsProp {
   // children: [React.ReactElement, React.ReactElement];
   children: React.ReactElement[] | React.ReactElement,
}

// Tabs =======================================================================

const Tabs: React.FC<TabsProp> = (props) => {
   return (
      <ActiveTabContextProvider>
         <StyledTabsArea>
            {props.children}
         </StyledTabsArea>
      </ActiveTabContextProvider>
   );
}
const EffectsPageDiv = styled.div`
   width: 100vw;
   height: 100vh;
`;
export const EffectsPage: React.FC = () => {
   return (
      <EffectsPageDiv>
         <Tabs>
            <ButtonBar>
               <TabButton index={0} title="Synth Effects" />
               <TabButton index={1} title="Drum Effects" />
               <TabButton index={2} title="Global Effects" />
               <BackButton />
            </ButtonBar>
            <TabPages>
               <TabPage index={0} element={<SynthEffectsPage />} />
               <TabPage index={1} element={<DrumEffectsPage />} />
               <TabPage index={2} element={<GlobalEffectsPage/>} />
            </TabPages>
         </Tabs>
      </EffectsPageDiv>
   )
}