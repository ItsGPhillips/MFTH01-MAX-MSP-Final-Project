import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push, Unsubscribe } from "firebase/database";
import { v4 as uuidV4 } from 'uuid';

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

export interface EventData {
   type: string,
   value: any,
}

export class RTCConnection {
   private client_id: string;
   private connection: RTCPeerConnection;
   private data_channel: RTCDataChannel;
   private unsubscribers: Unsubscribe[] = [];

   constructor() {
      // uuid to identify this clients data in the database
      this.client_id = uuidV4();
      this.connection = this.createRTCPeerConnection();

      // create a data channel
      this.data_channel = this.connection.createDataChannel("data-channel", {
         ordered: true,
      });

      this.connection.ondatachannel = event => {
         event.channel.onmessage = message => {
            const data = JSON.parse(message.data);
            console.log(data);
            switch (data.type) {
               case 'set-role': {
                  if (typeof data.value !== 'string') {
                     throw new Error(`Invalid value for message type: ${data.type} expected: string found ${typeof data.value}`);
                  }
                  window.dispatchEvent(new Event(`set-role-${data.value}`));
                  break;
               }
               default: {
                  throw new Error(`Received unknown message: ${data.type}`);
               }
            }
         }
      };

      this.createOffer();
   }

   destructor() {
      this.unsubscribers.forEach(unsubsciber => {
         unsubsciber();
      });
      this.connection.close();
   }

   // this little function is the only public method.
   send = (data: Object) => {
      this.data_channel.send(JSON.stringify(data));
   };

   private createOffer = async () => {
      // create an offer to store on the database. The host will listen for this offer and 
      // will create an answer to it. 
      const offerDescription = await this.connection.createOffer();
      await this.connection.setLocalDescription(offerDescription);
      const offer = {
         sdp: offerDescription.sdp,
         type: offerDescription.type
      };
      // store the answer in the database
      await set(ref(db, `clients/${this.client_id}/offer_description`), offer);

      this.unsubscribers.push(
         // listen for the host to create an answer for this peerConnection to use.   
         onValue(ref(db, `clients/${this.client_id}/host_answer`), async snapshot => {
            if (!snapshot.exists()) {
               return;
            }

            const answer: RTCSessionDescriptionInit = snapshot.val();
            await this.connection.setRemoteDescription(answer);

            // Once the remote description has been set it we can add its ice candidates
            // to our peerConnection.
            // This is required as Chrome doesn't follow the webRTC spec and requires
            // the peerConnection knows what peer its trying to connect to before adding
            // iceCandiates.
            this.populateIceCandidates();
         }));
   }


   private createRTCPeerConnection(): RTCPeerConnection {
      const peer_connection = new RTCPeerConnection({
         // a collection of free and open source STUN and TURN servers
         // for our RTCPeerConnection to use.
         iceServers: [
            {
               urls: [
                  'stun:stun1.1.google.com:19302',
                  'stun:stun2.1.google.com:19302',
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
         iceCandidatePoolSize: 5,
      });

      peer_connection.onconnectionstatechange = () => {
         if (peer_connection.connectionState === 'connected') {
            console.log("Peer Connected");
            window.dispatchEvent(new CustomEvent("peer-connected"));
            return;
         }
         if (peer_connection.connectionState === 'disconnected') {
            console.log("Peer Connected");
            window.dispatchEvent(new CustomEvent("peer-disconnected"));
            return;
         }
      };

      const client_ice_candiates = ref(db, `clients/${this.client_id}/ice_candidates`);

      // make sure the database id empty before pushing ice-candidates to it.
      set(client_ice_candiates, null);

      peer_connection.onicecandidate = async event => {
         // store every ice candidate for this client to the server for the host to use
         // the hosts peerConnection will use the icecandidates to create the p2p connection
         if (event.candidate) {
            await push(client_ice_candiates, event.candidate.toJSON());
         };
      }

      return peer_connection;
   }

   private populateIceCandidates() {
      // Listen to the hosts iceCandidates on the database and add them to our peerConnection
      // This is how webRTC is able to find servers and endpoints that are valid for 
      // accessing the remote peer.
      this.unsubscribers.push(
         onValue(ref(db, "host-ice-candidates"), host_ice_candiates => {
            if (!host_ice_candiates.exists()) {
               return;
            }
            host_ice_candiates.forEach(ice_candidate => {
               if (ice_candidate.exists()) {
                  let init: RTCIceCandidateInit = ice_candidate.val();
                  this.connection.addIceCandidate(init).catch(error => {
                     console.log(error);
                  });
               }
            });
         })
      );
   }
}

