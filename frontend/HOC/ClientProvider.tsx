"use client";
import store from "@/store/store";
import React, { ReactNode, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { Persistor, persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { Loader } from "lucide-react";

const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [persistor, setPersistor] = useState<Persistor | null>(null);
  
  useEffect(() => {
    const clientPersistor = persistStore(store);
    setPersistor(clientPersistor);
  }, []);

  if (!persistor) {
    return (
      <div className="h-screen flex justify-center items-center bg-background">
        <Loader className="w-20 h-20 animate-spin text-foreground" />
      </div>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate 
        loading={
          <div className="h-screen flex justify-center items-center bg-background">
            <Loader className="w-20 h-20 animate-spin text-foreground" />
          </div>
        } 
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ClientProvider;
