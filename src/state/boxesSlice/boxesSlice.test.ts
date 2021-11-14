import reducer, { addBox, deleteBox, editBox, BoxesState, selectBox } from '.';
import { isUuid } from 'uuidv4';
import { v4 } from 'uuid';

const initialState: BoxesState = {
  selectedBox: null,
  boxes: [
    { id: v4(), name: 'here before' },
    { id: v4(), name: 'another one' },
  ],
};

describe('boxes CRUD', () => {
  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      selectedBox: null,
      boxes: [],
    });
  });

  it('creates a new box', () => {
    const name = 'new box';
    const { boxes } = reducer(initialState, addBox({ name }));
    expect(boxes.length).toBe(initialState.boxes.length + 1);
    const newBox = boxes[boxes.length - 1];
    expect(newBox.name).toBe(name);
    expect(isUuid(newBox.id)).toBe(true);
  });

  it('only creates a new box with unique name', () => {
    const name = initialState.boxes[0].name;
    const { boxes } = reducer(initialState, addBox({ name }));
    expect(boxes.length).toBe(initialState.boxes.length);
  });

  it('deletes a box', () => {
    const boxToDelete = initialState.boxes[0];
    const { boxes } = reducer(initialState, deleteBox(boxToDelete));
    expect(boxes.find(({ id }) => id === boxToDelete.id)).toBe(undefined);
  });

  it('unsets selectedBox on delete', () => {
    const boxToDelete = initialState.boxes[0];
    const { selectedBox } = reducer(
      { ...initialState, selectedBox: boxToDelete },
      deleteBox(boxToDelete)
    );
    expect(selectedBox).toBe(null);
  });

  it('edits a box', () => {
    const chosenBox = initialState.boxes[0];
    const newBox = { ...chosenBox, name: 'new name for box' };
    const { boxes } = reducer(initialState, editBox(newBox));
    const editedBox = boxes.find((box) => box.id === chosenBox.id);
    expect(editedBox?.name).toEqual(newBox.name);
  });
});

describe('box selection', () => {
  it('should select a box if none selected', () => {
    const chosenBox = initialState.boxes[0];
    const { selectedBox } = reducer(initialState, selectBox(chosenBox));
    expect(selectedBox?.id).toBe(chosenBox.id);
  });

  it('should deselect a box if already selected', () => {
    const chosenBox = initialState.boxes[0];
    const { selectedBox } = reducer(
      { ...initialState, selectedBox: chosenBox },
      selectBox(chosenBox)
    );
    expect(selectedBox).toBe(null);
  });

  it('should select a different box if another selected', () => {
    const currentBox = initialState.boxes[0];
    const chosenBox = initialState.boxes[1];
    const { selectedBox } = reducer(
      { ...initialState, selectedBox: currentBox },
      selectBox(chosenBox)
    );
    expect(selectedBox?.id).toBe(chosenBox.id);
  });
});
