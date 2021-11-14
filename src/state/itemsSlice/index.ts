import { createSlice } from '@reduxjs/toolkit';
import { v4 } from 'uuid';
import { Item } from '../../types';

export interface SubmittedItem {
  name: string;
  box?: string;
  quantity?: number;
}

export interface ItemsState {
  selectedItem: Item | null;
  items: Item[];
}

const initialState: ItemsState = {
  selectedItem: null,
  items: [],
};

export const itemsSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const existing = state.items.find(
        ({ name }) => name === action.payload.name
      );
      if (existing)
        return {
          ...state,
          items: state.items.map((item) => ({
            ...item,
            quantity:
              item.id === existing.id
                ? Number(item.quantity) + 1
                : item.quantity,
          })),
        };

      const newItem = {
        quantity: 1,
        ...action.payload,
        id: v4(),
      };
      return {
        ...state,
        items: [...state.items, newItem],
      };
    },
    deleteItem: (state, action) => ({
      ...state,
      items: state.items.filter(({ id }) => id !== action.payload),
      selectedItem:
        state.selectedItem?.id === action.payload.id
          ? null
          : state.selectedItem,
    }),
    editItem: (state, action) => ({
      ...state,
      items: state.items.map((item) =>
        item.id === action.payload.id ? { ...item, ...action.payload } : item
      ),
    }),
    selectItem: (state, action) => ({
      ...state,
      selectedItem:
        state.selectedItem === action.payload ? null : action.payload,
    }),
  },
});

export const { addItem, deleteItem, editItem, selectItem } = itemsSlice.actions;
export default itemsSlice.reducer;
