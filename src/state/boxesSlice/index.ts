import { createSlice } from '@reduxjs/toolkit';
import { v4 } from 'uuid';
import { Box } from '../../types';

export interface SubmittedBox {
  name: string;
}

export interface BoxesState {
  selectedBox: Box | null;
  boxes: Box[];
}

const initialState: BoxesState = {
  selectedBox: null,
  boxes: [],
};

export const boxesSlice = createSlice({
  name: 'box',
  initialState,
  reducers: {
    addBox: (state, action) => {
      if (state.boxes.find(({ name }) => name === action.payload.name))
        return state;

      const newBox = {
        ...action.payload,
        id: v4(),
      };
      return {
        ...state,
        boxes: [...state.boxes, newBox],
      };
    },
    deleteBox: (state, action) => ({
      ...state,
      boxes: state.boxes.filter(({ id }) => id !== action.payload.id),
      selectedBox:
        state.selectedBox?.id === action.payload.id ? null : state.selectedBox,
    }),
    editBox: (state, action) => ({
      ...state,
      boxes: state.boxes.map((box) =>
        box.id === action.payload.id ? action.payload : box
      ),
    }),
    selectBox: (state, action) => ({
      ...state,
      selectedBox: state.selectedBox === action.payload ? null : action.payload,
    }),
  },
});

export const { addBox, deleteBox, editBox, selectBox } = boxesSlice.actions;

export default boxesSlice.reducer;
