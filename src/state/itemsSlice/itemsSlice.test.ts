import reducer, {
  addItem,
  deleteItem,
  editItem,
  ItemsState,
  selectItem,
} from '.';
import { v4 } from 'uuid';
import { isUuid } from 'uuidv4';

const initialState: ItemsState = {
  selectedItem: null,
  items: [
    { id: v4(), name: 'here before', quantity: 1, box: undefined },
    { id: v4(), name: 'another one', quantity: 1, box: undefined },
  ],
};
describe('items reducer', () => {
  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      selectedItem: null,
      items: [],
    });
  });

  it('creates a new item', () => {
    const name = 'new item';
    const { items } = reducer(initialState, addItem({ name }));
    expect(items.length).toBe(initialState.items.length + 1);
    const newItem = items[items.length - 1];
    expect(newItem.name).toBe(name);
    expect(newItem.quantity).toBe(1);
    expect(isUuid(newItem.id)).toBe(true);
  });

  it('increments quantity if box name is the same', () => {
    const idx = 0;
    const { name, quantity } = initialState.items[idx];
    const { items } = reducer(initialState, addItem({ name }));
    expect(items.length).toBe(initialState.items.length);
    expect(items[idx].quantity).toBe(quantity + 1);
  });

  it('creates a new item and adds it straight to a box', () => {
    const name = 'new item';
    const box = v4();
    const { items } = reducer(initialState, addItem({ name, box }));
    expect(items.length).toBe(initialState.items.length + 1);
    const newItem = items[items.length - 1];
    expect(newItem.name).toBe(name);
    expect(newItem.box).toBe(box);
    expect(isUuid(newItem.id)).toBe(true);
  });

  it('deletes an item', () => {
    const itemToDelete = initialState.items[0];
    const { items } = reducer(initialState, deleteItem(itemToDelete));
    expect(items.find(({ id }) => id === itemToDelete)).toBe(undefined);
  });

  it('unsets selectedItem on delete', () => {
    const itemToDelete = initialState.items[0];
    const { selectedItem } = reducer(
      { ...initialState, selectedItem: itemToDelete },
      deleteItem(itemToDelete)
    );
    expect(selectedItem).toBe(null);
  });

  it('adds/moves an item to a box', () => {
    const chosenItemIdx = 0;
    const chosenId = initialState.items[chosenItemIdx].id;
    const box = v4();
    const { items } = reducer(initialState, editItem({ id: chosenId, box }));
    items.forEach((item, idx) =>
      expect(item.box).toBe(idx === chosenItemIdx ? box : undefined)
    );
  });

  it('edits an item', () => {
    const chosenItem = initialState.items[0];
    const newItem = { id: chosenItem.id, name: 'new name for item' };
    const { items } = reducer(initialState, editItem(newItem));
    const editedItem = items.find((item) => item.id === newItem.id);
    expect(editedItem?.name).toEqual(newItem.name);
    expect(editedItem?.quantity).toEqual(chosenItem.quantity);
  });
});

describe('box selection', () => {
  it('should select a item if none selected', () => {
    const chosenItem = initialState.items[0];
    const { selectedItem } = reducer(initialState, selectItem(chosenItem));
    expect(selectedItem?.id).toBe(chosenItem.id);
  });

  it('should deselect a item if already selected', () => {
    const chosenItem = initialState.items[0];
    const { selectedItem } = reducer(
      { ...initialState, selectedItem: chosenItem },
      selectItem(chosenItem)
    );
    expect(selectedItem).toBe(null);
  });

  it('should select a different item if another selected', () => {
    const currentItem = initialState.items[0];
    const chosenItem = initialState.items[1];
    const { selectedItem } = reducer(
      { ...initialState, selectedItem: currentItem },
      selectItem(chosenItem)
    );
    expect(selectedItem?.id).toBe(chosenItem.id);
  });
});
