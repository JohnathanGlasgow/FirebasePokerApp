/**
 * Checkbox.js
 * 
 * This file exports a Checkbox component that renders a checkbox input.
 * When clicked, it toggles the completion status of a todo item.
 */

import React from 'react';
import Form from 'react-bootstrap/Form';
import { setDocument } from '../queries.js';
import { useAuth } from '../contexts/AuthContext';

/**
 * Checkbox component for handling todo item's completion status.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.todo - The todo item.
 * @param {string} props.todo.id - The ID of the todo item.
 * @param {boolean} props.todo.completed - The completion status of the todo item.
 * @returns {React.JSX.Element} The Checkbox component.
 */
const Checkbox = ({ todo, setIsLoading, setErrorMessage, groupId  }) => {
    const { uid } = useAuth();

    /**
     * Handles the checkbox input.
     * Toggles the completion status of the todo item.
     */
    const handleCheckbox = async () => {
        setErrorMessage('');
        setIsLoading(true);
        try {
            console.log(groupId);
            const path = groupId ? ['groups', groupId, 'todos'] : ['users', uid, 'todos'];
            await setDocument([...path, todo.id], { completed: !todo.completed });
        } catch (error) {
            setErrorMessage("Error updating todo item: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form.Check
            className="todo-checkbox"
            type="checkbox"
            onChange={handleCheckbox}
            checked={todo.completed} // Pass the todoCompleted prop to control checkbox state
        />
    );
}

export default Checkbox;