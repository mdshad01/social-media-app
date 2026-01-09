"use client";
import store from "@/store/store";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { HomeSkeleton } from "@/components/Skeleton";

// Create persistor outside component to avoid recreation on re-renders
const persistor = persistStore(store);

const ClientProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={<HomeSkeleton />} 
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ClientProvider;
