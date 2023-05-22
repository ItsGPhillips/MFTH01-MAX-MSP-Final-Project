// import './global_styles.css'
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import MidiPianoPage from './performance_pages/midi_piano';
import WaitingForConnectionPage from './loading_page/loading_page';
import RTCPeerConnectionProvider from './connection/context';
import styled from 'styled-components';

import Lottie from "react-lottie";
import rotatePhoneAnim from "./rotatePhoneAnimation.json";
import useSize from '@react-hook/size';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';

import { DrumsPage } from './performance_pages/drums_page';
import { EffectsPage } from './performance_pages/effects/effects';

const MAIN_FONT_NAME: string = "Zen Kaku Gothic Antique";

export const ROLE = {
  PIANO_PLAYER: 'piano-mode',
  XY_PAD_CONTROLLER: 'xy-pad-mode',
  NOT_CONNECTED: null
};

/*
  /* @import url('https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap'); */
/* & > * {
  font-family: 'Kosugi Maru', sans-serif;
} 
*/

const PageBase = styled.div`
  height: 100vh;
  width: 100vw;
  background: radial-gradient(circle, #222831 0%, #15181d 100%);
`;

const RotateDeviceDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  margin: auto;
  min-width: 100vw;
  min-height: 100vh;

  & * {
    font-family: ${MAIN_FONT_NAME};
    font-weight: 400;
    color: #b5d5d3;
  }
`;

const RotateDeviceAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: rotatePhoneAnim,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <RotateDeviceDiv>
      <h2>Please rotate your device</h2>
      <Lottie
        options={defaultOptions}
        height={"15rem"}
        width={"15rem"}
      />
    </RotateDeviceDiv>
  );
};

const OrientionChecker: React.FC = (props) => {
  const ref = useRef(null);
  const [w, h] = useSize(ref);

  return (
    <div ref={ref} style={{
      width: "100vw",
      height: "100vh",
    }}>
      {w < h ? <RotateDeviceAnimation /> : props.children}
    </div>
  );
}

const HomeDiv = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: "row";
  justify-content: space-evenly;
  align-items: center;
`;

const HomePageButton = styled.button`
  width: 25%;
  height: 50%;
  background-color: white;
  border-radius: 1rem;
`;

const PianoButton: React.FC = () => {
  let navigate = useNavigate();
  const onclick = () => {
    navigate("/piano");
  }
  return (
    <HomePageButton onClick={onclick}>
      <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        viewBox="0 0 32 32">
        <path d="M29,2H3C2.4,2,2,2.4,2,3v10v16c0,0.6,0.4,1,1,1h26c0.6,0,1-0.4,1-1V13V3C30,2.4,29.6,2,29,2z M6,6c0-0.6,0.4-1,1-1h10
	c0.6,0,1,0.4,1,1v4c0,0.6-0.4,1-1,1H7c-0.6,0-1-0.4-1-1V6z M8,28H4V14h1v7c0,0.6,0.4,1,1,1h2V28z M15,28h-5v-6c0.6,0,1-0.4,1-1v-7h2
	v7c0,0.6,0.4,1,1,1h1V28z M22,28h-5v-6h1c0.6,0,1-0.4,1-1v-7h2v7c0,0.6,0.4,1,1,1V28z M20,8c0-1.7,1.3-3,3-3s3,1.3,3,3s-1.3,3-3,3
	S20,9.7,20,8z M28,28h-4v-6h2c0.6,0,1-0.4,1-1v-7h1V28z" stroke='#d2d9da' fill='#161616' />
      </svg>
    </HomePageButton>
  )
};

const DrumMachineButton: React.FC = () => {
  let navigate = useNavigate();
  const onclick = () => {
    navigate("/drums");
  }

  //viewBox="0 0 207.928 207.928"
  return (
    <HomePageButton onClick={onclick}>
      <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="-20 -20 250 250">
        <g>
          <g>
            <g>
              <path d="M69.138,54.585c10.737-1.507,22.096-2.273,33.749-2.273c12.243,0,24.05,0.82,35.098,2.437
				l0.537,0.079l5.601-5.608l-2.065-0.336c-12.365-2.004-25.546-3.024-39.171-3.024c-13.102,0-25.836,0.956-37.832,2.817
				l-2.086,0.329l5.647,5.64L69.138,54.585z"/>
            </g>
            <g>
              <path d="M157.292,52.011l-0.594-0.15l-5.343,5.325l1.882,0.447c22.88,5.411,37.664,14.469,37.664,23.08
				c0,5.322-5.912,11.087-16.28,15.937v-1.16h-6.453v3.826c-8.772,3.26-19.63,5.848-31.53,7.519v-1.077h-6.442v1.908
				c-8.75,0.948-17.937,1.432-27.31,1.432c-3.103,0-6.374-0.068-9.956-0.204v-3.139h-6.449v2.799
				c-13.861-0.863-26.505-2.788-37.632-5.726v-3.751H42.4v1.897c-17.017-5.447-27.521-13.152-27.521-20.267
				c0-8.793,15.267-17.959,38.906-23.345l1.897-0.429l-5.358-5.365l-0.591,0.147C26.943,57.308,12.234,66.305,9.11,76.502H8.43
				v93.544c0,10.69,12.365,20.525,33.97,27.031v3.328h6.449v-1.585c11.238,2.824,23.892,4.692,37.632,5.533v3.575h6.449v-3.235
				c3.604,0.132,6.875,0.2,9.956,0.2c9.352,0,18.528-0.48,27.31-1.417v1.564h6.449v-2.376c12.88-1.746,24.197-4.406,33.659-7.909
				h4.32v-1.732c11.749-5,19.226-11.159,21.738-17.88h0.981V81.594l-0.043-0.394c0.036-0.168,0.047-0.329,0.047-0.49
				C197.347,68.936,182.749,58.475,157.292,52.011z M14.879,170.046V93.712c5.737,5.497,15.167,10.311,27.521,14.029v82.578
				C25.379,184.873,14.879,177.167,14.879,170.046z M86.481,115.006v82.883c-13.861-0.859-26.505-2.781-37.632-5.719v-82.689
				C60.087,112.304,72.742,114.169,86.481,115.006z M190.905,93.712v76.333c0,5.325-5.912,11.094-16.28,15.937v-82.306
				C181.632,100.698,187.09,97.348,190.905,93.712z M168.172,106.199v82.45c-8.772,3.26-19.63,5.851-31.53,7.526v-82.858
				C148.621,111.696,159.214,109.302,168.172,106.199z M92.93,115.346c3.604,0.132,6.875,0.204,9.956,0.204
				c9.352,0,18.528-0.476,27.31-1.414v82.861c-8.75,0.956-17.937,1.439-27.31,1.439c-3.103,0-6.374-0.068-9.956-0.204
				C92.93,198.233,92.93,115.346,92.93,115.346z"/>
            </g>
            <g>
              <path d="M119.704,70.689c-1.428,1.421-2.208,3.314-2.208,5.322c0,2.011,0.78,3.894,2.208,5.325
				c1.417,1.417,3.314,2.197,5.322,2.197s3.897-0.78,5.311-2.197c2.054-2.054,2.713-5.118,1.75-7.834l68.943-68.936L196.477,0
				l-68.936,68.943C124.803,67.987,121.715,68.682,119.704,70.689z"/>
            </g>
            <g>
              <path d="M77.588,81.601c1.417,1.421,3.303,2.205,5.322,2.205c2.011,0,3.894-0.78,5.311-2.205
				c1.428-1.428,2.212-3.314,2.212-5.322c0-2.011-0.78-3.894-2.212-5.318c-2.008-2.015-5.111-2.702-7.823-1.754L11.451,0.268
				L6.898,4.831l68.936,68.936C74.875,76.491,75.533,79.551,77.588,81.601z"/>
            </g>
          </g>
        </g>
      </svg>
    </HomePageButton>
  )
};
const EffectsPageButton: React.FC = () => {
  let navigate = useNavigate();
  const onclick = () => {
    navigate("/effects");
  }

  //viewBox="0 0 207.928 207.928"
  return (
    <HomePageButton onClick={onclick}>
      <svg style={{
        margin: "1rem",
      }} version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 471.8 471.8">
        <g>
          <g>
            <path d="M70.5,14.9C31.6,14.9,0,46.5,0,85.4c0,34.8,25.3,63.7,58.5,69.4v290.1c0,6.6,5.4,12,12,12s12-5.4,12-12V154.8
			c33.2-5.7,58.5-34.7,58.5-69.4C141,46.5,109.3,14.9,70.5,14.9z M70.5,131.9c-25.6,0-46.5-20.8-46.5-46.5s20.8-46.5,46.5-46.5
			S117,59.7,117,85.4S96.1,131.9,70.5,131.9z"/>
            <path d="M235.3,253.9c6.6,0,12-5.4,12-12s-5.4-12-12-12s-12,5.4-12,12C223.3,248.6,228.7,253.9,235.3,253.9z" />
            <path d="M235.3,124.9c6.6,0,12-5.4,12-12c0-6.6-5.4-12-12-12s-12,5.4-12,12C223.3,119.5,228.7,124.9,235.3,124.9z" />
            <path d="M235.3,210.9c6.6,0,12-5.4,12-12s-5.4-12-12-12s-12,5.4-12,12S228.7,210.9,235.3,210.9z" />
            <path d="M235.3,81.9c6.6,0,12-5.4,12-12c0-6.6-5.4-12-12-12s-12,5.4-12,12C223.3,76.5,228.7,81.9,235.3,81.9z" />
            <path d="M235.3,296.9c6.6,0,12-5.4,12-12s-5.4-12-12-12s-12,5.4-12,12C223.3,291.6,228.7,296.9,235.3,296.9z" />
            <path d="M235.3,167.9c6.6,0,12-5.4,12-12s-5.4-12-12-12s-12,5.4-12,12S228.7,167.9,235.3,167.9z" />
            <path d="M235.3,315.9c-38.9,0-70.5,31.6-70.5,70.5s31.6,70.5,70.5,70.5s70.5-31.6,70.5-70.5S274.2,315.9,235.3,315.9z
			 M235.3,432.9c-25.6,0-46.5-20.8-46.5-46.5s20.8-46.5,46.5-46.5c25.6,0,46.5,20.8,46.5,46.5S260.9,432.9,235.3,432.9z"/>
            <path d="M401.3,14.9c-38.9,0-70.5,31.6-70.5,70.5c0,34.8,25.3,63.7,58.5,69.4v290.1c0,6.6,5.4,12,12,12s12-5.4,12-12V154.8
			c33.2-5.7,58.5-34.7,58.5-69.4C471.8,46.5,440.2,14.9,401.3,14.9z M401.3,131.9c-25.6,0-46.5-20.8-46.5-46.5s20.9-46.5,46.5-46.5
			s46.5,20.8,46.5,46.5S427,131.9,401.3,131.9z"/>
          </g>
        </g>
      </svg>
    </HomePageButton>
  )
};

const HomePage: React.FC = () => {
  return (
    <HomeDiv>
      <PianoButton />
      <DrumMachineButton />
      <EffectsPageButton />
    </HomeDiv>)
};


const App: React.FC = () => {
  const [is_ready, set_is_ready] = useState(false);
  const perf_ready_callback = () => {
    set_is_ready(true);
  };
  useEffect(() => {
    window.addEventListener("performance-ready", perf_ready_callback);
    return () => { window.removeEventListener("performance-ready", perf_ready_callback) }
  })
  const create_ui = (): React.ReactNode => {
    if (is_ready) {
      return (
        <OrientionChecker >
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/piano" element={<MidiPianoPage />}></Route>
            <Route path="/drums" element={<DrumsPage />}></Route>
            <Route path="/effects" element={<EffectsPage />}></Route>
          </Routes>
        </OrientionChecker>
      )
    } else {
      return <WaitingForConnectionPage />
    }
  }
  return (
    <RTCPeerConnectionProvider>
      <BrowserRouter>
        <PageBase>
          {create_ui()}
        </PageBase>
      </BrowserRouter>
    </RTCPeerConnectionProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
