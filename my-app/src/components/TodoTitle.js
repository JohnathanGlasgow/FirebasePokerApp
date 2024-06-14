/**
 * TodoTitle.js
 * 
 * This file exports a TodoTitle component that represents the text of a todo item.
 */

import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { setDocument } from '../queries.js';
import { useAuth } from '../contexts/AuthContext';

/**
 * TodoTitle component - represents the text of a todo item.
 * When clicked, the user can edit the text.
 * Upon pressing enter or changing focus, the text is updated.
 *
 * @component
 * @param {Object} props - The props that were defined by the caller of this component.
 * @param {Object} props.todo - The todo item.
 * @param {string} props.todo.title - The title of the todo item.
 * @returns {React.JSX.Element} The TodoTitle component.
 */
const TodoTitle = ({ todo, setIsLoading, setErrorMessage, groupId }) => {
    const { uid } = useAuth();

    /**
     * The title of the todo item.
     * @type {string}
     */
    const [title, setTitle] = useState(todo.title);

    /**
     * Handles the editing of the todo item.
     * Updates the todo item in the database.
     */
    const handleEdit = async () => {
        console.log(title);
        setErrorMessage('');
        setIsLoading(true);
        try {
            const path = groupId ? ['groups', groupId, 'todos'] : ['users', uid, 'todos'];
            await setDocument([...path, todo.id], { title: title });
        } catch (error) {
            setErrorMessage("Error updating todo item: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form.Control
            className='todo-title'
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={setErrorMessage('')}
            onBlur={handleEdit}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();  // Prevent form submission
                    handleEdit();
                }
            }}
        />
    );
}

export default TodoTitle;