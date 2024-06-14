/**
 * NewTodo.js
 * 
 * This file exports a NewTodo component that renders a form control for adding new todo items.
 * When the Enter key is pressed, a new todo item is created and added to the database.
 */

import { useContext } from 'react';
import { addDocument } from '../queries.js';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner.js';

/**
 * NewTodo component for adding new todo items.
 *
 * @component
 * @returns {React.JSX.Element} The NewTodo component.
 */
const NewTodo = ({ setErrorMessage, groupId }) => {
    const [newTodo, setNewTodo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { uid } = useAuth();


    /**
     * Creates a new todo object.
     *
     * @param {string} title - The title of the todo.
     * @returns {Object} The new todo object.
     */
    const createTodo = (title) => {
        return {
            title: title,
            completed: false,
            // add the current date and time to the todo
            dateCreated: new Date().toISOString(),
        };
    }

    /**
     * Handles the key press event for the form control.
     * If the Enter key is pressed, a new todo item is created and added to the database.
     *
     * @param {Object} event - The event object.
     */
    const handleKeyPress = async (event) => {
        if (isLoading) return;
        setErrorMessage('');
        if (event.key === 'Enter') {
            setNewTodo('');
            setIsLoading(true);
            if (newTodo === '' || newTodo === null || newTodo === undefined) {
                setErrorMessage("Please enter a valid todo.");
                setIsLoading(false);
                return;
            }
            try {
                const path = groupId ? ['groups', groupId, 'todos'] : ['users', uid, 'todos'];
                await addDocument(path, createTodo(newTodo));              
            } catch (error) {
                setErrorMessage("Error adding todo: " + error.message);
                console.error("Error adding todo: ", error);
                // Optionally, show an error message to the user
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <>
            <LoadingSpinner show={isLoading} />
            <Form.Control
                type="text"
                placeholder="New Todo..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className='new-todo-input'
            />
        </>
    );
}

export default NewTodo;