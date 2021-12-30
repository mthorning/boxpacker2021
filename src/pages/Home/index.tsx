import { useState, ReactNode } from 'react';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { Form, List, FormValues, FormSchemaItem } from '../../components';
import { useSelector, useDispatch } from 'react-redux';
import {
  addItem,
  editItem,
  selectItem,
  deleteItem,
  addBox,
  editBox,
  selectBox,
  deleteBox,
} from '../../state';
import { RootState } from '../../state/store';
import { Entity, ID } from '../../types';
import './Home.css';

enum Mode {
  List,
  Form,
}

interface TopPanelProps {
  children: ReactNode;
}

function TopPanel({ children }: TopPanelProps) {
  return (
    <>
      <div className="top-panel">{children}</div>
      <hr />
    </>
  );
}

interface FormSubmitObject extends FormValues {
  id?: ID;
}

interface PanelProps {
  selectedEntityID?: ID;
  listEntities: Entity[];
  selectedListEntity: Entity | null;
  onEntitySelect: (entity: Entity) => void;
  onEntityDelete: (entityID: ID) => void;
  initialValues: FormValues;
  formSchema: FormSchemaItem[];
  onFormSubmit: ActionCreatorWithPayload<FormSubmitObject>;
}

function Panel({
  selectedEntityID,
  listEntities,
  selectedListEntity,
  onEntitySelect,
  initialValues,
  onFormSubmit,
  onEntityDelete,
  formSchema: schema,
}: PanelProps) {
  const [mode, setMode] = useState(Mode.List);
  const dispatch = useDispatch();

  return (
    <div className="home-panel">
      {mode === Mode.Form && (
        <>
          <TopPanel>
            <button onClick={() => setMode(Mode.List)}>Close</button>
          </TopPanel>
          <Form
            {...{ schema, initialValues }}
            handleSubmit={(formValues) => {
              dispatch(onFormSubmit({ id: selectedEntityID, ...formValues }));
              setMode(Mode.List);
            }}
          />
        </>
      )}
      {mode === Mode.List && (
        <>
          <TopPanel>
            <div>
              <button onClick={() => setMode(Mode.Form)}>
                {selectedListEntity ? 'Edit' : 'Add'}
              </button>
              {selectedEntityID ? (
                <button onClick={() => onEntityDelete(selectedEntityID)}>
                  Delete
                </button>
              ) : null}
            </div>
          </TopPanel>
          <List
            entities={listEntities}
            selected={selectedListEntity}
            select={(entity: Entity) => onEntitySelect(entity)}
          />
        </>
      )}
    </div>
  );
}

export function Home() {
  const {
    box: { boxes, selectedBox },
    item: { items, selectedItem },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  return (
    <div className="home">
      <Panel
        selectedEntityID={selectedBox?.id}
        initialValues={{
          name: selectedBox?.name ?? '',
        }}
        onFormSubmit={selectedBox ? editBox : addBox}
        formSchema={[{ label: 'Name', name: 'name', type: 'text' }]}
        listEntities={boxes}
        selectedListEntity={selectedBox}
        onEntitySelect={(box: Entity) => {
          dispatch(selectItem(null));
          dispatch(selectBox(box));
        }}
        onEntityDelete={(id) => dispatch(deleteItem(id))}
      />
      <Panel
        selectedEntityID={selectedItem?.id}
        initialValues={{
          name: selectedItem?.name ?? '',
          quantity: selectedItem?.quantity ?? 1,
          box: selectedItem?.box ?? selectedBox?.id ?? undefined,
        }}
        onFormSubmit={selectedItem ? editItem : addItem}
        listEntities={items.filter(
          ({ box }) => !selectedBox?.id || box === selectedBox?.id
        )}
        selectedListEntity={selectedItem}
        onEntitySelect={(item) => dispatch(selectItem(item))}
        onEntityDelete={(id) => dispatch(deleteItem(id))}
        formSchema={[
          { label: 'Name', name: 'name', type: 'text' },
          {
            label: 'Box',
            name: 'box',
            type: 'select',
            options: [
              { label: '', value: undefined },
              ...boxes.map(({ id, name }) => ({
                label: name,
                value: id,
              })),
            ],
          },
          { label: 'Quantity', name: 'quantity', type: 'number', min: 1 },
        ]}
      />
    </div>
  );
}
