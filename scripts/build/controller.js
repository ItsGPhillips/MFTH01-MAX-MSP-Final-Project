"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
autowatch = 1;
inlets = 1;
outlets = 1;
var assert = function (expression, message) {
    if (!expression) {
        throw new Error(message !== null && message !== void 0 ? message : "Assertion Failed");
    }
};
var clients = {};
var global_effects = patcher.getnamed("global-effects");
if (!global_effects) {
    throw new Error("global-effects was undefined");
}
var global_effects_message_proxy = patcher.getnamed("global-effects-message-proxy");
if (!global_effects_message_proxy) {
    throw new Error("global-effects-message-proxy was undefined");
}
var createObject = function (name) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    // gross hacky code i know.
    if (name === "message") {
        return patcher.newdefault.apply(patcher, __spreadArray([46, 430, name], args, false));
    }
    else {
        return patcher.newdefault.apply(patcher, __spreadArray([46, 523, name], args, false));
    }
};
var Synth = /** @class */ (function () {
    function Synth() {
        var _this = this;
        this.destructor = function () {
            patcher.remove(_this.message_proxy);
            patcher.remove(_this.object);
        };
        this.callback = function (args) {
            // arg[0] is client_id
            assert(args[1] === "dictionary", "arg[1] must be a valid dictionary");
            assert(typeof args[2] === "string", "arg[2] must be a valid dictionary name");
            var dict = new Dict(args[2]);
            switch (dict.get("type")) {
                case "midi-note-down":
                    _this.message_proxy.message("set", "midi-note-down", dict.get("midi_number"));
                    _this.message_proxy.message("bang");
                    break;
                case "midi-note-up":
                    _this.message_proxy.message("set", "midi-note-up", dict.get("midi_number"));
                    _this.message_proxy.message("bang");
                    break;
                case "control-data":
                    break;
                case "drum-hit":
                    _this.message_proxy.message("set", "drum-hit", dict.get("message"));
                    _this.message_proxy.message("bang");
                    break;
                case "synth-effect-data":
                    _this.handle_synth_effect_data(dict.get("effect"), dict.get("value"));
                    break;
                case "global-effect-data":
                    _this.handle_global_effect_data(dict.get("effect"), dict.get("value"));
                    break;
                case "drum-effect-data":
                    _this.handle_drum_effect_data(dict.get("effect"), dict.get("value"));
                    break;
                default:
                    {
                        throw new Error("Invalid Midi Keyboard message");
                    }
                    ;
            }
        };
        this.handle_synth_effect_data = function (effect, value) {
            _this.message_proxy.message("set", "synth-effect", effect, value);
            _this.message_proxy.message("bang");
        };
        this.handle_global_effect_data = function (effect, value) {
            global_effects_message_proxy.message("set", effect, value);
            global_effects_message_proxy.message("bang");
        };
        this.handle_drum_effect_data = function (effect, value) {
            _this.message_proxy.message("set", "drum-effect", effect, value);
            _this.message_proxy.message("bang");
        };
        this.message_proxy = createObject("message");
        this.object = createObject("synth-patch");
        patcher.connect(this.message_proxy, 0, this.object, 0);
        patcher.connect(this.object, 0, global_effects, 0);
        patcher.connect(this.object, 1, global_effects, 1);
    }
    return Synth;
}());
var synths = {};
var createJSON = function (clients) {
    return JSON.stringify(clients);
};
var getAvailablePerformanceMode = function () {
    return "midi-keyboard";
};
// forwards the recieved message to the clients assigned message callback.
var proccessClientData = function (args) {
    var client_id = args[0];
    assert(typeof client_id === "string", "arg[0] must be a string");
    var client = clients[client_id];
    if (client !== undefined) {
        client.message_callback(args);
    }
    else {
        throw new Error("Message received for non-existant client");
    }
};
var handleConnectedClient = function (client_id) {
    if (clients[client_id] === undefined) {
        var synth = new Synth();
        clients[client_id] = {
            performance_mode: 'midi-keyboard',
            message_callback: synth.callback
        };
        synths[client_id] = synth;
    }
    else {
        throw new Error("Tried to replace an already exisiting client.");
    }
};
var handleDisconnectedClient = function (client_id) {
    if (clients[client_id] !== undefined) {
        if (synths[client_id]) {
            synths[client_id].destructor();
            delete synths[client_id];
        }
        delete clients[client_id];
    }
    else {
        throw new Error("Tried to delete a non-nexistent client.");
    }
};
// main entry point for messages
function anything() {
    var args = arrayfromargs(arguments);
    switch (messagename) {
        case "dataChannelOpened":
            {
                assert(typeof args[0] === "string", "arg[0] must be a string");
                handleConnectedClient(args[0]);
                outlet(0, "clients", createJSON(clients));
                break;
            }
            ;
        case "dataChannelClosed":
            {
                assert(typeof args[0] === "string", "arg[0] must be a string");
                handleDisconnectedClient(args[0]);
                outlet(0, "clients", createJSON(clients));
                break;
            }
            ;
        case "clientData": {
            proccessClientData(args);
            break;
        }
        case "bang": outlet(0, "clients", createJSON(clients));
    }
}
// this is required by typescript to correctly generate modules
var module = {};
module.exports = {};
