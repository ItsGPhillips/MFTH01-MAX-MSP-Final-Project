autowatch = 1;
inlets = 1;
outlets = 1

const assert = (expression: boolean, message?: string) => {
   if (!expression) {
      throw new Error(message ?? "Assertion Failed");
   }
}

type PerformanceMode = 'midi-keyboard' | "xy-controller";

interface Clients {
   [id: string]: {
      performance_mode: PerformanceMode,
      message_callback: (args: any[]) => any,
   }
}

const clients: Clients = {};

const global_effects = patcher.getnamed("global-effects");
if(!global_effects) {
   throw new Error("global-effects was undefined");
}
const global_effects_message_proxy = patcher.getnamed("global-effects-message-proxy");
if(!global_effects_message_proxy) {
   throw new Error("global-effects-message-proxy was undefined");
}

const createObject = (name: string, ...args: any[]): Maxobj => {
   // gross hacky code i know.
   if(name === "message") {
      return patcher.newdefault(46, 430, name, ...args);
   } else {
      return patcher.newdefault(46, 523, name, ...args);
   }
}


class Synth {
   private object: Maxobj;
   private message_proxy: Maxobj;
   constructor() {
      this.message_proxy = createObject("message");
      this.object = createObject("synth-patch");
      patcher.connect(this.message_proxy, 0, this.object, 0);
      patcher.connect(this.object, 0, global_effects, 0);
      patcher.connect(this.object, 1, global_effects, 1);
   }
   destructor = () => {
      patcher.remove(this.message_proxy);
      patcher.remove(this.object);
   }
   public callback = (args: any[]) => {
      // arg[0] is client_id
      assert(args[1] === "dictionary", "arg[1] must be a valid dictionary");
      assert(typeof args[2] === "string", "arg[2] must be a valid dictionary name");
      const dict = new Dict(args[2]);
      switch (dict.get("type")) {
         case "midi-note-down":
            this.message_proxy.message("set", "midi-note-down", dict.get("midi_number"));
            this.message_proxy.message("bang");
            break;
         case "midi-note-up":
            this.message_proxy.message("set", "midi-note-up", dict.get("midi_number"));
            this.message_proxy.message("bang");
            break;
         case "control-data":
            break;
         case "drum-hit":
            this.message_proxy.message("set", "drum-hit", dict.get("message"));
            this.message_proxy.message("bang");
            break;
         case "synth-effect-data":
            this.handle_synth_effect_data(dict.get("effect"), dict.get("value"));
            break;
         case "global-effect-data":
            this.handle_global_effect_data(dict.get("effect"), dict.get("value"));
            break;
         case "drum-effect-data":
            this.handle_drum_effect_data(dict.get("effect"), dict.get("value"));
            break;
         default: {
            throw new Error("Invalid Midi Keyboard message")
         };
      }
   };

   private handle_synth_effect_data = (effect: string, value: number) => {
      this.message_proxy.message("set", "synth-effect", effect, value);
      this.message_proxy.message("bang");
   };

   private handle_global_effect_data = (effect: string, value: number) => {
      global_effects_message_proxy.message("set", effect, value);
      global_effects_message_proxy.message("bang");
   };
   private handle_drum_effect_data = (effect: string, value: number) => {
      this.message_proxy.message("set", "drum-effect", effect, value);
      this.message_proxy.message("bang");
   };
}

interface Synths {
   [id: string]: Synth,
}
const synths: Synths = {};

const createJSON = (clients: Clients): string => {
   return JSON.stringify(clients);
};

const getAvailablePerformanceMode = (): PerformanceMode => {
   return "midi-keyboard";
}

// forwards the recieved message to the clients assigned message callback.
const proccessClientData = (args: any[]) => {
   const client_id = args[0];
   assert(typeof client_id === "string", "arg[0] must be a string");
   const client = clients[client_id];
   if (client !== undefined) {
      client.message_callback(args);
   } else {
      throw new Error("Message received for non-existant client");
   }
}

const handleConnectedClient = (client_id: string) => {
   if (clients[client_id] === undefined) {
      const synth = new Synth();
      clients[client_id] = {
         performance_mode: 'midi-keyboard',
         message_callback: synth.callback,
      };
      synths[client_id] = synth;
   } else {
      throw new Error("Tried to replace an already exisiting client.");
   }
};
const handleDisconnectedClient = (client_id: string) => {
   if (clients[client_id] !== undefined) {
      if (synths[client_id]) {
         synths[client_id].destructor();
         delete synths[client_id];
      }
      delete clients[client_id];
   } else {
      throw new Error("Tried to delete a non-nexistent client.");
   }
};

// main entry point for messages
function anything() {
   const args: any[] = arrayfromargs(arguments);
   switch (messagename) {
      case "dataChannelOpened": {
         assert(typeof args[0] === "string", "arg[0] must be a string");
         handleConnectedClient(args[0]);
         outlet(0, "clients", createJSON(clients));
         break;
      };
      case "dataChannelClosed": {
         assert(typeof args[0] === "string", "arg[0] must be a string");
         handleDisconnectedClient(args[0]);
         outlet(0, "clients", createJSON(clients));
         break;
      };
      case "clientData": {
         proccessClientData(args);
         break;
      }
      case "bang": outlet(0, "clients", createJSON(clients));
   }
}

// this is required by typescript to correctly generate modules
let module = {};
export = {};
