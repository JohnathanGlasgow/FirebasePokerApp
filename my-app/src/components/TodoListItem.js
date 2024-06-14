/**
 * TodoListItem.js
 * 
 * This file exports a TodoListItem component that renders a single todo item.
 */

import React, {useState, useEffect} from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import DeleteButton from './DeleteButton.js';
import Checkbox from './Checkbox.js';
import TodoTitle from './TodoTitle.js';
import LoadingSpinner from './LoadingSpinner.js';


/**
 * TodoListItem component for displaying a single todo item.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.todo - The todo item to display.
 * @returns {React.JSX.Element} The TodoListItem component.
 */
const TodoListItem = ({ todo, setErrorMessage, groupId }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <ListGroup.Item key={todo.id} className="todo-item">
            <LoadingSpinner show={isLoading} />
            <div className="todo-item-content">
                <Checkbox todo={todo} setErrorMessage={setErrorMessage} setIsLoading={setIsLoading} groupId={groupId} />
                <TodoTitle todo={todo} setErrorMessage={setErrorMessage}  setIsLoading={setIsLoading} groupId={groupId} />
                <DeleteButton todoId={todo.id} setErrorMessage={setErrorMessage} setIsLoading={setIsLoading} groupId={groupId} />
            </div>
        </ListGroup.Item>
    );
}

export default TodoListItem;