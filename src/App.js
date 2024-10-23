import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

import { ReactComponent as BacklogIcon } from './Backlog.svg';
import { ReactComponent as NoPriorityIcon } from './in-progress.svg';
import { ReactComponent as ToDoIcon } from './To-do.svg';
import { ReactComponent as DoneIcon } from './Done.svg';
import { ReactComponent as CancelledIcon } from './Cancelled.svg';
import { ReactComponent as AddIcon } from './add.svg';
import { ReactComponent as ThreeDotMenuIcon } from './3-dot-menu.svg';
import { ReactComponent as DisplayIcon } from './Display.svg';
import { ReactComponent as UrgentPriorityIcon } from './SVG - Urgent Priority colour.svg';
import { ReactComponent as HighPriorityIcon } from './Img - High Priority.svg';
import { ReactComponent as MediumPriorityIcon } from './Img - Medium Priority.svg';
import { ReactComponent as LowPriorityIcon } from './Img - Low Priority.svg';
import { ReactComponent as NoPriorityGroupIcon } from './No-priority.svg';

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState('status');
  const [sortBy, setSortBy] = useState('priority');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.quicksell.co/v1/internal/frontend-assignment');
        setTickets(response.data.tickets || []);
        setUsers(response.data.users || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const savedGroupBy = localStorage.getItem('groupBy');
    const savedSortBy = localStorage.getItem('sortBy');
    if (savedGroupBy) setGroupBy(savedGroupBy);
    if (savedSortBy) setSortBy(savedSortBy);
  }, []);

  const handleGroupChange = (event) => {
    setGroupBy(event.target.value);
    localStorage.setItem('groupBy', event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    localStorage.setItem('sortBy', event.target.value);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const priorityOrder = ['0', '4', '3', '2', '1'];
  const statusOrder = ['Backlog', 'Todo', 'In progress', 'Done', 'Canceled'];
  const getPriorityGroupLabel = (priority) => {
    switch (priority) {
      case '0': return 'No Priority';
      case '4': return 'Urgent';
      case '3': return 'High';
      case '2': return 'Medium';
      case '1': return 'Low';
      default: return 'Unknown';
    }
  };

  const getUserName = (userId, users) => {
    const user = users.find(user => user.id === userId);
    return user ? user.name : 'Unknown User';
  };
  const groupTickets = (tickets, groupBy) => {
    if (groupBy === 'status') {
      const groups = {
        'Backlog': [],
        'Todo': [],
        'In progress': [],
        'Done': [],
        'Canceled': []
      };
      tickets.forEach(ticket => {
        if (groups[ticket.status]) {
          groups[ticket.status].push(ticket);
        }
      });
      return groups;
    } else if (groupBy === 'priority') {
      const groups = {
        '0': [],
        '4': [],
        '3': [],
        '2': [],
        '1': [] 
      };
      tickets.forEach(ticket => {
        if (groups[ticket.priority] !== undefined) {
          groups[ticket.priority].push(ticket);
        }
      });
      return groups;
    } else if (groupBy === 'userId') {
      const groups = {};
      tickets.forEach(ticket => {
        const userName = getUserName(ticket.userId, users);
        if (!groups[userName]) {
          groups[userName] = [];
        }
        groups[userName].push(ticket);
      });
      return groups;
    } else {
      return tickets.reduce((groups, ticket) => {
        const key = ticket[groupBy];
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(ticket);
        return groups;
      }, {});
    }
  };

  const sortTickets = (groupedTickets, sortBy) => {
    const sortedGroups = {};
    for (const key in groupedTickets) {
      sortedGroups[key] = groupedTickets[key].sort((a, b) => {
        if (sortBy === 'priority') {
          return b.priority - a.priority;
        } else if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
    }
    return sortedGroups;
  };

  const groupedTickets = groupTickets(tickets, groupBy);
  const sortedTickets = sortTickets(groupedTickets, sortBy);

  const orderedGroupKeys = groupBy === 'priority' ? priorityOrder : groupBy === 'status' ? statusOrder : Object.keys(groupedTickets);

  return (
    <div className="app">
      <div className="header">
        <div className="display-container" onClick={toggleDropdown}>
          <span className="display-label">
            <DisplayIcon />
            Display
          </span>
        </div>

        {showDropdown && (
          <div className="floating-dropdown">
            <div className="dropdown">
              <label>
                Grouping:
                <select value={groupBy} onChange={handleGroupChange}>
                  <option value="status">Status</option>
                  <option value="userId">User</option>
                  <option value="priority">Priority</option>
                </select>
              </label>
            </div>
            <div className="dropdown">
              <label>
                Ordering :
                <select value={sortBy} onChange={handleSortChange}>
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
                </select>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="kanban-board">
        {orderedGroupKeys.map((groupKey) => (
          <div key={groupKey} className="kanban-column">
            <div className="kanban-column-header">
              <div className="left-section">
                {groupBy === 'priority' && groupKey === '0' && <NoPriorityGroupIcon />}
                {groupBy === 'priority' && groupKey === '4' && <UrgentPriorityIcon />}
                {groupBy === 'priority' && groupKey === '3' && <HighPriorityIcon />}
                {groupBy === 'priority' && groupKey === '2' && <MediumPriorityIcon />}
                {groupBy === 'priority' && groupKey === '1' && <LowPriorityIcon />}
                {groupBy === 'status' && groupKey === 'Backlog' && <BacklogIcon />}
                {groupBy === 'status' && groupKey === 'Todo' && <ToDoIcon />}
                {groupBy === 'status' && groupKey === 'In progress' && <NoPriorityIcon />}
                {groupBy === 'status' && groupKey === 'Done' && <DoneIcon />}
                {groupBy === 'status' && groupKey === 'Canceled' && <CancelledIcon />}
                {groupBy === 'userId' && (
                  <div className="profile-symbol">
                    {groupKey.slice(0, 2).toUpperCase()} 
                  </div>
                )}
                <span className="group-title">
                  {groupBy === 'priority' ? getPriorityGroupLabel(groupKey) : groupKey} {sortedTickets[groupKey]?.length || 0}
                </span>
              </div>
              <div className="right-section">
                <AddIcon className="add-icon" />
                <ThreeDotMenuIcon className="three-dot-icon" />
              </div>
            </div>

            {sortedTickets[groupKey]?.map(ticket => (
              <div key={ticket.id} className={`ticket-card priority-${ticket.priority}`}>
                <div className="card-header">
                  <span className="ticket-id">{ticket.id}</span>
                  {groupBy!=='userId' &&
                  <div className="profile-symbol">
                    {getUserName(ticket.userId, users).slice(0, 2).toUpperCase()} 
                  </div>}
                </div>
                <div className="ticket-title-section">
                  {groupBy!=='status' && ticket.status === 'Backlog' && <BacklogIcon className="ticket-icon" />}
                  {groupBy!=='status' && ticket.status === 'Todo' && <ToDoIcon className="ticket-icon" />}
                  {groupBy!=='status' && ticket.status === 'In progress' && <NoPriorityIcon className="ticket-icon" />}
                  {groupBy!=='status' && ticket.status === 'Done' && <DoneIcon className="ticket-icon" />}
                  {groupBy!=='status' && ticket.status === 'Canceled' && <CancelledIcon className="ticket-icon" />}
                  <h3 className="ticket-title">{ticket.title}</h3>
                </div>
                <div className="ticket-tag">
                {groupBy !== 'priority' && ticket.priority === 0 && <NoPriorityGroupIcon className="ticket-icon-1"/>}
                {groupBy !== 'priority' && ticket.priority === 4 && <UrgentPriorityIcon className="ticket-icon-1"/>}
                {groupBy !== 'priority' && ticket.priority === 3 && <HighPriorityIcon className="ticket-icon-1"/>}
                {groupBy !== 'priority' && ticket.priority === 2 && <MediumPriorityIcon className="ticket-icon-1"/>}
                {groupBy !== 'priority' && ticket.priority === 1 && <LowPriorityIcon className="ticket-icon-1"/>}
                <span className='ticket-1' ><span className='Dot'/>{ticket.tag}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};


export default App;
