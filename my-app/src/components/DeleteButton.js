/**
 * DeleteButton.js
 * 
 * This file exports a DeleteButton component that renders a button with a trashcan icon.
 * When clicked, it deletes a todo item.
 */

import React from 'react';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { deleteDocument } from '../queries.js';
import { useAuth } from '../contexts/AuthContext';

/**
 * DeleteButton component for deleting a todo item.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.todoId - The ID of the todo item to delete.
 * @returns {React.JSX.Element} The DeleteButton component.
 */
const DeleteButton = ({ todoId, setErrorMessage, setIsLoading, groupId }) => {
    const { uid } = useAuth();

    /**
     * Handles the deletion of the todo item.
     */
    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const path = groupId ? ['groups', groupId, 'todos'] : ['users', uid, 'todos'];
            await deleteDocument([...path, todoId]);
        } catch (error) {
            setErrorMessage("Error deleting todo item: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button variant="danger" onClick={handleDelete} className='delete-button'>
            <FontAwesomeIcon icon={faTrash} />
        </Button>
    );
}

export default DeleteButton;