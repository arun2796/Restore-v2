import { createSlice } from "@reduxjs/toolkit";

export type counterstate = {
  data: number;
};
const initialState: counterstate = {
  data: 0,
};

export const counterSlice = createSlice({
  name: "count",
  initialState,
  reducers: {
    increment: (state, action) => {
      state.data += action.payload;
    },
    decrement: (state, action) => {
      state.data -= action.payload;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;

// export function incrementlegacy(amount = 1) {
//   return {
//     type: "increment",
//     payload: amount,
//   };
// }
// export function decrementlegacy(amount = 1) {
//   return {
//     type: "decrement",
//     payload: amount,
//   };
// }

// export default function counterReducer(
//   state = initialState,
//   action: { type: string; payload: number }
// ) {
//   switch (action.type) {
//     case "increment":
//       return {
//         ...state,
//         data: state.data + action.payload,
//       };
//     case "decrement":
//       return {
//         ...state,
//         data: state.data - action.payload,
//       };
//     case "reset":
//       return {
//         data: 0,
//       };

//     default:
//       return state;
//   }
// }
