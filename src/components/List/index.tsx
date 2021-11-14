import { Box, Item } from '../../types';
import './List.css';

interface ListProps {
  entities: Array<Box | Item>;
  select: (entity: Box | Item) => void;
  selected: Box | Item | null;
}
export function List({ entities, select, selected }: ListProps) {
  return entities.length ? (
    <ul className="list">
      {entities.map((entity) => (
        <li
          key={entity.id}
          {...(selected?.id === entity.id ? { className: 'selected' } : {})}
          onClick={() => select(entity)}
        >
          {`${entity.name}${
            'quantity' in entity && entity.quantity > 1 ? ` (${entity.quantity})` : ''
          }`}
        </li>
      ))}
    </ul>
  ) : (
    <p>No Data</p>
  );
}
