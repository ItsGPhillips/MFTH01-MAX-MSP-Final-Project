"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase/app");
const database_1 = require("firebase/database");
const max_api_1 = __importDefault(require("max-api"));
const app = (0, app_1.initializeApp)({
    apiKey: "AIzaSyDComJbGv1Ae3IIaFT1xCV6sd107fBq9bI",
    authDomain: "mfth01-iip-server.firebaseapp.com",
    databaseURL: "https://mfth01-iip-server-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "mfth01-iip-server",
    storageBucket: "mfth01-iip-server.appspot.com",
    messagingSenderId: "864595370036",
    appId: "1:864595370036:web:d80adc44297df4e0e16a61",
    measurementId: "G-1843WV6T4W"
});
const db = (0, database_1.getDatabase)(app);
(0, database_1.set)((0, database_1.ref)(db), null);
/* eslint-disable */
const DefaultRTCPeerConnection = require('wrtc').RTCPeerConnection;
/* eslint-enable */
let needsToSetupIceCandidates = true;
class ConnectedClient {
    constructor(client_id) {
        this.unsubscribers = [];
        this.send = (data) => {
            this.data_channel.send(JSON.stringify(data));
        };
        this.handleClientDisconnect = () => {
            this.destructor();
        };
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
        (0, database_1.set)((0, database_1.ref)(db, `clients/${this.client_id}`), {});
    }
    createRTCPeerConnection() {
        const connection = new DefaultRTCPeerConnection({
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
    setupCallacks() {
        this.connection.onconnectionstatechange = () => {
            if (this.connection.connectionState === "disconnected") {
                console.log(`${this.client_id}: Connection Disconnected`);
                max_api_1.default.post([`${this.client_id}: Connection Disconnected`]);
                max_api_1.default.outlet(this.toJSON());
                this.handleClientDisconnect();
            }
        };
        this.connection.ondatachannel = event => {
            event.channel.onmessage = message => {
                this.handleMessage(message);
            };
            event.channel.onopen = () => {
                max_api_1.default.outlet(["dataChannelOpened", this.client_id]);
                this.send({
                    type: "set-role",
                    value: Math.random() > 0.5 ? "piano-mode" : "xy-pad-mode"
                });
            };
            event.channel.onclose = () => {
                max_api_1.default.outlet(["dataChannelClosed", this.client_id]);
                this.handleClientDisconnect();
            };
        };
    }
    handleMessage(message) {
        max_api_1.default.outlet([
            "clientData",
            this.client_id,
            JSON.parse(message.data)
        ]);
    }
    setupIceCandiates() {
        const offerCandidates = (0, database_1.ref)(db, "host-ice-candidates");
        (0, database_1.set)(offerCandidates, null);
        this.connection.onicecandidate = (event) => __awaiter(this, void 0, void 0, function* () {
            // manually destructing the IceCandidate as wrtc doesnt implient it
            if (event.candidate) {
                const { candidate, sdpMLineIndex, sdpMid, usernameFragment } = event.candidate;
                const iceCandidate = {
                    candidate,
                    sdpMLineIndex,
                    sdpMid,
                    usernameFragment
                };
                yield (0, database_1.push)(offerCandidates, iceCandidate);
            }
        });
    }
    handleNewClient(client) {
        return __awaiter(this, void 0, void 0, function* () {
            this.unsubscribers.push((0, database_1.onValue)((0, database_1.ref)(db, `clients/${client.name}/ice_candidates`), snapshot => {
                if (!snapshot.exists()) {
                    return;
                }
                snapshot.forEach(ice_candidate => {
                    if (!ice_candidate.exists()) {
                        return;
                    }
                    this.connection.addIceCandidate(ice_candidate.val());
                });
            }));
            this.connection.setRemoteDescription(client.offer_description);
            const answerDescription = yield this.connection.createAnswer();
            yield this.connection.setLocalDescription(answerDescription);
            const answer = {
                sdp: answerDescription.sdp,
                type: answerDescription.type
            };
            yield (0, database_1.set)((0, database_1.ref)(db, `clients/${client.name}/host_answer`), answer);
        });
    }
    toJSON() {
        return {
            client: this.client_id,
            protocol: this.data_channel.protocol,
            state: this.data_channel.readyState
        };
    }
}
const connections = {};
// when the client loads the website it will connect to the the database and
// store its RTCSessionDescription (offer) and its ice candidates
// (after it revieces the answer RTCSessionDescription).
// The host will listen to this data being added and will create an RTCPeerConnection
// to answer the offer.
(0, database_1.onChildAdded)((0, database_1.ref)(db, "clients"), (snapshot) => {
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
    const client = {
        name: snapshot.key,
        offer_description
    };
    connections[snapshot.key] = new ConnectedClient(snapshot.key);
    connections[snapshot.key].handleNewClient(client);
});
// The ConnectedClient will remove its clients data from the database when
// its clients connection is closed.
// We can listen for this event and remove the client from the RTCPeerConnectionMap
(0, database_1.onChildRemoved)((0, database_1.ref)(db, "clients"), snapshot => {
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
