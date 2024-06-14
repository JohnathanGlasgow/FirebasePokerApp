/**
 * CreateGroupForm.js
 * This component is for adding groups
 */

import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { addDocument } from '../queries';
import { useAuth } from '../contexts/AuthContext';

export const CreateGroupForm = () => {
    const { uid } = useAuth();
    const [groupName, setGroupName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        setError('');
        e.preventDefault();
        if (groupName === '') {
            setError('Please enter a group name.');
            return;
        }
        try {
            setIsLoading(true);
            await addDocument(['groups'], { name: groupName, members: [uid] });
            setGroupName('');
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit} className='groups-form'>
            
            <Form.Group controlId="formGroupName">
                <Form.Control
                    type="text"
                    placeholder="Enter group name"
                    value={groupName}
                    onFocus={() => setError('')}
                    onChange={(e) => setGroupName(e.target.value)}
                    isInvalid={error !== ''}
                />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? 'Creating Group' : 'Create Group'}
            </Button>
        </Form>
    );
};
