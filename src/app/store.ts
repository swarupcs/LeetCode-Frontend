import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '@/features/auth/authSlice';


/* ============================= */
/*       Persist Config          */
/* ============================= */

const persistConfig = {
  key: 'auth',
  storage,
};

/* ============================= */
/*    Persisted Reducer          */
/* ============================= */

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

/* ============================= */
/*         Store Setup           */
/* ============================= */

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

/* ============================= */
/*     Persistor Setup           */
/* ============================= */

export const persistor = persistStore(store);

/* ============================= */
/*        TS TYPES               */
/* ============================= */

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
