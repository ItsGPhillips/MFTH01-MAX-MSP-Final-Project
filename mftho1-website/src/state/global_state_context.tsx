import React, { createContext, useContext, useState } from "react";

export type PerformanceMode = 'piano-mode'; // | 'xy-pad-mode';

// export type ContextHook<T> = [T, React.Dispatch<React.SetStateAction<T>>];
export type ContextHook<T> = [T, (value: T) => void];
export interface GlobalStateHooks {
   nameHook: ContextHook<string | null>,
   roleHook: ContextHook<PerformanceMode | null>,
}

const defaultSetHook = () => {
   throw new Error("Must be called inside a context provider");
}

const globalStateHooksContext = createContext<GlobalStateHooks>({
   nameHook: [null, defaultSetHook],
   roleHook: [null, defaultSetHook],
});

export const useGlobalStateHooks = (): GlobalStateHooks => {
   return useContext(globalStateHooksContext);
}

const GlobalStateHooksProvider: React.FC = (props) => {
   const value: GlobalStateHooks = {
      nameHook: useState<string | null>(null),
      roleHook: useState<PerformanceMode | null>(null),
   };
   return (
      <globalStateHooksContext.Provider value={value}>
         {props.children}
      </globalStateHooksContext.Provider>
   );
}

export default GlobalStateHooksProvider;