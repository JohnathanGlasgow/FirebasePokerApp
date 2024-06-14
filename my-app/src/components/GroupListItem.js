/**
 * GroupListItem.js
 * This component displays the group listings
 */

import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDocument, setDocument, deleteDocument } from '../queries';
import LoadingSpinner from './LoadingSpinner.js';

/**
 * GroupListItem component.
 * Renders a single group listing.
 * 
 * @component
 * @param {Object} group - The group object.
 * @returns {React.JSX.Element} The rendered GroupListItem component.
 */
export const GroupListItem = ({ group }) => {
    const navigate = useNavigate();
    const { uid } = useAuth();
    const [isLoading, setIsLoading] = React.useState(false);

    const getMembers = async (groupPath) => {
        const groupDoc = await getDocument(groupPath);
        const groupData = groupDoc.data();
        return groupData.members || [];
    }

    const joinGroup = async (groupId) => {
        setIsLoading(true);
        const groupPath = ['groups', groupId];
        const members = await getMembers(groupPath);
        const newMembers = [...members, uid];
        
        try {           
            await setDocument(groupPath, { members: newMembers });
        }
        catch (error) {
            console.error("Error joining group: ", error);
        }
        finally {
            setIsLoading(false);
        }
    };

    const leaveGroup = async (groupId) => {
        setIsLoading(true);
        const groupPath = ['groups', groupId];
        const members = await getMembers(groupPath);
        const newMembers = members.filter((member) => member !== uid);      
        try {          
            newMembers?.length >= 1 ? await setDocument(groupPath, { members: newMembers }) : await deleteDocument(groupPath);
        }
        catch (error) {
            console.error("Error leaving group: ", error);
        }
        finally {
            setIsLoading(false);
        }
    }

    if (!group) {
        return null;
    }
    
    return (
        <li key={group.id} style={{ listStyleType: 'none', position: 'relative' }} className='groups-li'>
            <LoadingSpinner show={isLoading} alt={true} />
            <p
                onClick={() => navigate(`/groups/${group.id}`)}
                style={{ cursor: 'pointer', color: 'white', textDecoration: 'underline' }}
            >
                {group.name}
            </p>
            <div className='button-group'>
                <Button variant="primary" onClick={() => joinGroup(group.id)} disabled={group.members?.includes(uid)}>
                    Join
                </Button>
                <Button variant="secondary" onClick={() => leaveGroup(group.id)} disabled={!group.members?.includes(uid)}>
                    {group.members?.length !== 1 ? 'Leave' : 'Delete'}
                </Button>
            </div>
        </li>
    );
};
