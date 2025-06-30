/* eslint-disable no-unused-vars */
import '../assets/styles/board.css';
import star from '../assets/img/star.png';
import avatars from '../assets/avatars';
import avatarMap from '../assets/avatars/avatarMap';

export default function Board({ spotlightPositions = [], players = [], overrides = {} }) {
  const size = 10;
  const total = size * size;

  const board = Array.from({ length: total }, (_, i) => ({
    id: i,
    number: i + 1,
    hasStar: spotlightPositions.includes(i + 1),
  }));

  return (
    <div className="board-container">
      {board.map((cell) => {
        const playersInCell = players.filter((p) => {
          const overridden = overrides[p.username];
          const pos = overridden !== undefined ? overridden : p.boardPosition;
          return pos === cell.number;
        });

        return (
          <div className="cell" key={cell.id}>
            <span className="cell-number">{cell.number}</span>
            {cell.hasStar && <img src={star} alt="star" className="star" />}
            {playersInCell.length > 0 && (
              <div className="avatar-stack">
                {playersInCell.map((p) => (
                  <div key={p.id} className="avatar-wrapper">
                    <img
                      src={avatars[avatarMap[p.avatarName]]}
                      alt={p.avatarName}
                      className="avatar-icon"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
