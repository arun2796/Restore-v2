import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "../../features/contact/counterReducer";

import { catalogApi } from "../../features/catalog/catalogApi";
import { uislice } from "../layout/uiSlice";
import { errorApi } from "../../features/about/errorApi";
import { basketApi } from "../../features/basket/basketApi";
import { catalogSlice } from "../../features/catalog/catalogslice";
import { AccountApi } from "../../features/account/accountApi";
import { checkoutApi } from "../../features/checkout/checkoutApi";
import { OrderApi } from "../../features/order/orderApi";
import { adminApi } from "../../features/admin/adminApi";

// export function configureTheStore() {
//   return legacy_createStore(counterReducer);
// }

export const store = configureStore({
  reducer: {
    [catalogApi.reducerPath]: catalogApi.reducer,
    [errorApi.reducerPath]: errorApi.reducer,
    [basketApi.reducerPath]: basketApi.reducer,
    [AccountApi.reducerPath]: AccountApi.reducer,
    [checkoutApi.reducerPath]: checkoutApi.reducer,
    [OrderApi.reducerPath]: OrderApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    counter: counterSlice.reducer,
    ui: uislice.reducer,
    catalog: catalogSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      catalogApi.middleware,
      errorApi.middleware,
      basketApi.middleware,
      AccountApi.middleware,
      checkoutApi.middleware,
      OrderApi.middleware,
      adminApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
