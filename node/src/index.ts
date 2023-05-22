import { initializeApp } from "firebase/app";
import {
   getDatabase, onValue, ref, set, push, onChildAdded,
   onChildRemoved, DataSnapshot, Unsubscribe
} from "firebase/database";
import MaxAPI, { JSONObject } from "max-api";

const app = initializeApp({
   apiKey: "AIzaSyDComJbGv1Ae3IIaFT1xCV6sd107fBq9bI",
   authDomain: "mfth01-iip-server.firebaseapp.com",
   databaseURL: "https://mfth01-iip-server-default-rtdb.europe-west1.firebasedatabase.app",
   projectId: "mfth01-iip-server",
   storageBucket: "mfth01-iip-server.appspot.com",
   messagingSenderId: "864595370036",
   appId: "1:864595370036:web:d80adc44297df4e0e16a61",
   measurementId: "G-1843WV6T4W"
});
const db = getDatabase(app);
set(ref(db), null);

/* eslint-disable */
const DefaultRTCPeerConnection = require('wrtc').RTCPeerConnection;
/* eslint-enable */

let needsToSetupIceCandidates = true;

interface Client {
   name: string,
   offer_description: RTCSessionDescriptionInit,
}

class ConnectedClient {
   private client_id: string;
   private connection: RTCPeerConnection;
   private data_channel: RTCDataChannel;
   private unsubscribers: Unsubscribe[] = [];

   constructor(client_id: string) {
      this.client_id = client_id;
      this.connection = this.createRTCPeerConnection();
      this.setupCallacks();

      this.data_channel = this.connection.createDataChannel("data-channel", {
         ordered: true,
         protocol: "json"
      });

      if (needsToSetupIceCandidates) {
         this.setupIceCandiates();
         needsToSetupIceCandidates = false;
      }
   }

   destructor() {
      this.unsubscribers.forEach(unsubsciber => {
         unsubsciber();
      });
      this.connection.close();
      // clearInterval(this.timer);
      set(ref(db, `clients/${this.client_id}`), {});
   }

   send = (data: Record<string, unknown>) => {
      this.data_channel.send(JSON.stringify(data));
   };

   private createRTCPeerConnection(): RTCPeerConnection {
      const connection: RTCPeerConnection = new DefaultRTCPeerConnection({
         // a collection of free and open source STUN and TURN servers
         // for our RTCPeerConnection to use.
         iceServers: [
            {
               urls: [
                  "stun:stun1.1.google.com:19302",
                  "stun:stun2.1.google.com:19302",
                  "stun:openrelay.metered.ca:80"
               ]
            },
            {
               urls: [
                  "turn:openrelay.metered.ca:80",
                  "turn:openrelay.metered.ca:443",
                  "turn:openrelay.metered.ca:443?transport=tcp"
               ],
               username: "openrelayproject",
               credential: "openrelayproject"
            }
         ],
         iceCandidatePoolSize: 5
      });
      return connection;
   }

   private setupCallacks() {
      this.connection.onconnectionstatechange = () => {
         if (this.connection.connectionState === "disconnected") {
            console.log(`${this.client_id}: Connection Disconnected`);
            MaxAPI.post([`${this.client_id}: Connection Disconnected`]);
            MaxAPI.outlet(this.toJSON());
            this.handleClientDisconnect();
         }
      };

      this.connection.ondatachannel = event => {
         event.channel.onmessage = message => {
            this.handleMessage(message);
         };
         event.channel.onopen = () => {
            MaxAPI.outlet("dataChannelOpened", this.client_id).then(() => {
               this.send({
                  type: "set-role",
                  value: Math.random() > 0.5 ? "piano-mode" : "xy-pad-mode"
               });
            });
         };
         event.channel.onclose = () => {
            MaxAPI.outlet(["dataChannelClosed", this.client_id]).then(() => {
               this.handleClientDisconnect();
            });
         };
      };
   }

   private handleMessage(message: MessageEvent) {
      MaxAPI.outlet([
         "clientData",
         this.client_id,
         JSON.parse(message.data)
      ]);
   }

   private handleClientDisconnect = () => {
      this.destructor();
   };

   private setupIceCandiates() {
      const offerCandidates = ref(db, "host-ice-candidates");
      set(offerCandidates, null);

      this.connection.onicecandidate = async event => {
         // manually destructing the IceCandidate as wrtc doesnt implient it
         if (event.candidate) {
            const {
               candidate,
               sdpMLineIndex,
               sdpMid,
               usernameFragment
            } = event.candidate;

            const iceCandidate = {
               candidate,
               sdpMLineIndex,
               sdpMid,
               usernameFragment
            };
            await push(offerCandidates, iceCandidate);
         }
      };
   }

   async handleNewClient(client: Client) {
      this.unsubscribers.push(
         onValue(ref(db, `clients/${client.name}/ice_candidates`), snapshot => {
            if (!snapshot.exists()) {
               return;
            }
            snapshot.forEach(ice_candidate => {
               if (!ice_candidate.exists()) {
                  return;
               }
               this.connection.addIceCandidate(ice_candidate.val());
            });
         })
      );

      this.connection.setRemoteDescription(client.offer_description);
      const answerDescription = await this.connection.createAnswer();

      await this.connection.setLocalDescription(answerDescription);
      const answer = {
         sdp: answerDescription.sdp,
         type: answerDescription.type
      };
      await set(ref(db, `clients/${client.name}/host_answer`), answer);
   }

   toJSON(): JSONObject {
      return {
         client: this.client_id,
         protocol: this.data_channel.protocol,
         state: this.data_channel.readyState
      };
   }
}

interface RTCPeerConnectionMap {
   [key: string]: ConnectedClient
}

const connections: RTCPeerConnectionMap = {};

// when the client loads the website it will connect to the the database and
// store its RTCSessionDescription (offer) and its ice candidates
// (after it revieces the answer RTCSessionDescription).
// The host will listen to this data being added and will create an RTCPeerConnection
// to answer the offer.
onChildAdded(ref(db, "clients"), (snapshot: DataSnapshot) => {
   if (!snapshot.exists()) {
      return;
   }
   if (!snapshot.key) {
      throw new Error("client key was null");
   }

   if (connections[snapshot.key]) {
      throw new Error("client already exists");
   }

   const { offer_description } = snapshot.val();
   const client: Client = {
      name: snapshot.key,
      offer_description
   };

   connections[snapshot.key] = new ConnectedClient(snapshot.key);
   connections[snapshot.key].handleNewClient(client);
});

// The ConnectedClient will remove its clients data from the database when
// its clients connection is closed.
// We can listen for this event and remove the client from the RTCPeerConnectionMap
onChildRemoved(ref(db, "clients"), snapshot => {
   if (!snapshot.exists()) {
      return;
   }
   if (!snapshot.key) {
      throw new Error("client key was null");
   }
   if (!connections[snapshot.key]) {
      throw new Error("client doesnt exist");
   }
   connections[snapshot.key];
   delete connections[snapshot.key];
});

