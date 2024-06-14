/**
 * GroupListItem.js
 * This component is for managing groups
 */

import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToCollection } from '../queries';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Alert, Collapse } from 'react-bootstrap';
import { GroupListItem } from './GroupListItem';
import { CreateGroupForm } from './CreateGroupForm'; 
import LoadingSpinner from './LoadingSpinner.js';   

export default function GroupsCard() {
    const navigate = useNavigate();
    const { user, uid } = useAuth();
    const { groupId } = useParams();
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        try {
            console.log("Getting groups...");
            setIsLoading(true);
            return subscribeToCollection(['groups'], handleSnapshot);
        }
        catch (error) {
            console.error("Error getting groups: ", error);
            setError("An error occurred. Please try again.");
        }
        finally {
            console.log("Done getting groups.");
            setIsLoading(false);
        }
    }, []);

    const handleSnapshot = (snapshot) => {
        const groups = snapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
        });
        setGroups(groups);
        setIsLoading(false);
    }

    return (
        <Card className='group-card'>
            <LoadingSpinner show={isLoading} />
            <Card.Body>
                <Card.Title>Groups
                    <Button
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                        className="btn btn-link"
                        style={{ textDecoration: 'none', color: 'white'}}
                    >
                        {open ? '▲' : '▼'}
                    </Button>
                </Card.Title>
                <Collapse in={open}>
                    <div id="group-collapse">
                        <Card.Text>Create a new group:</Card.Text>
                        <CreateGroupForm />
                        {error && <Alert variant="danger">{error}</Alert>}
                        {!groups ?
                            ''
                            :
                            <>
                                <Card.Text>Available Groups <span style={{fontStyle: 'italic'}}>(click the name to navigate to the group page)</span>:</Card.Text>
                                <ul className='groups-list'>
                                    {
                                        groups.map((group) => (
                                            <GroupListItem key={group.id} group={group}  />
                                        ))
                                    }
                                </ul>
                            </>
                        }
                        {groupId && <p onClick={() => navigate(`/user/${user.uid}`)} style={{ cursor: 'pointer', color: 'white', textDecoration: 'underline', fontStyle: 'italic'}}>Back to your todo list</p>}
                    </div>

                </Collapse>
            </Card.Body>
        </Card>
    );
}