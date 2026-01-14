"use client";
import store from "@/store/store";
import { ReactNode, useState } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { HomeSkeleton } from "@/components/Skeleton";

// Create persistor outside component to avoid recreation on re-renders
const persistor = persistStore(store);

const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [isRehydrated, setIsRehydrated] = useState(false);

  return (
    <Provider store={store}>
      <PersistGate 
        loading={<HomeSkeleton />} 
        persistor={persistor}
        onBeforeLift={() => {
          // This ensures we wait for rehydration before rendering
          return new Promise((resolve) => {
            setTimeout(() => {
              setIsRehydrated(true);
              resolve();
            }, 100); // Small delay to ensure state is fully loaded
          });
        }}
      >
        {isRehydrated ? children : <HomeSkeleton />}
      </PersistGate>
    </Provider>
  );
};

export default ClientProvider;
