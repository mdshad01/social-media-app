// frontend/HOC/ClientProvider.tsx
"use client";
import store from "@/store/store";
import { ReactNode, useState } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { HomeSkeleton } from "@/components/Skeleton";

const persistor = persistStore(store);

const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [isRehydrated, setIsRehydrated] = useState(false);

  return (
    <Provider store={store}>
      <PersistGate 
        loading={<HomeSkeleton />} 
        persistor={persistor}
        onBeforeLift={() => {
          return new Promise((resolve) => {
            setTimeout(() => {
              setIsRehydrated(true);
              resolve();
            }, 100);
          });
        }}
      >
        {isRehydrated ? children : <HomeSkeleton />}
      </PersistGate>
    </Provider>
  );
};

export default ClientProvider;
