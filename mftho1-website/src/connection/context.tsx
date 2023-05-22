import React, { createContext } from 'react';
import { RTCConnection } from './connection';
import { useContext } from 'react';

const connection = new RTCConnection();
window.onunload = window.onbeforeunload = event => {
   event.preventDefault();
   connection.destructor();
};
const RTCPeerConnectionContext = createContext<RTCConnection>(connection);
export const usePeerConnection = (): RTCConnection => {
   return useContext(RTCPeerConnectionContext);
}
const RTCPeerConnectionProvider: React.FC = (props) => {
   return (
      <RTCPeerConnectionContext.Provider value={connection}>
         {props.children}
      </RTCPeerConnectionContext.Provider>
   );
};
export default RTCPeerConnectionProvider;