/**
 * GroupPage.js
 * 
 * This component displays the group page.
 */


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { subscribeToDocument } from '../queries';
import { Alert } from 'react-bootstrap';
import TodoList from './TodoList';
import { useAuth } from '../contexts/AuthContext';

/**
 * GroupPage component.
 * Shows the todo list for a group if the user is a member of the group.
 * 
 * @component
 * @returns {React.JSX.Element} The rendered GroupPage component.
 */
export default function GroupPage() {
    const { uid  } = useAuth();
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            setIsLoading(true);
            return subscribeToDocument(['groups', groupId], handleSnapshot);
        }
        catch (error) {
            console.error("Error getting group: ", error);
            setError("An error occurred. Please try again.");
        }
        finally {
            setIsLoading(false);
        }
    }, [group?.members]);

    const handleSnapshot = (snapshot) => {
        if (snapshot.exists()) {
            setGroup({ id: snapshot.id, ...snapshot.data() });
        } else {
            setError('No such group exists.');
        }
    }


    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!group) {
        return <Alert variant="info">Loading...</Alert>;
    }

    if (uid && !group.members?.includes(uid)) {
        return <Alert variant="danger">{`You are not a member of ${group.name}`}</Alert>;
    }
    return (
        <>
            <TodoList groupId={groupId} group={group} /> 
        </>
    );
}

