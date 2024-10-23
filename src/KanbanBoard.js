import React from 'react';

const KanbanBoard = ({ groupedTickets, sortTickets }) => {
  // Ensure groupedTickets is an object
  if (!groupedTickets || Object.keys(groupedTickets).length === 0) {
    return <div>No tickets available</div>;
  }

  const sortedTickets = sortTickets(groupedTickets);

  return (
    <div className="kanban-board">
      {Object.keys(sortedTickets).map((group) => (
        <div key={group} className="kanban-column">
          <h2>{group}</h2>
          <ul>
            {sortedTickets[group].map((ticket) => (
              <li key={ticket.id}>
                <strong>{ticket.title}</strong> (Priority: {ticket.priority})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
