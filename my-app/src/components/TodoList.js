/**
 * TodoList.js
 * 
 * This file exports a TodoList component that renders a list of todo items.
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import NewTodo from './NewTodo.js';
import TodoListItem from './TodoListItem.js';
import { subscribeToCollection } from '../queries.js';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner.js';
import Card from 'react-bootstrap/Card';

/**
 * TodoList component.
 * 
 * @component
 * @returns {React.JSX.Element} The rendered TodoList component.
 */
const TodoList = ({ groupId, group }) => {
    const { uid, user, authLoading, loggingOut, userName } = useAuth();
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [todos, setTodos] = useState([]);

    /**
     * Effect hook for subscribing to the user's todos collection in Firestore.
     * Unsubscribes when the component unmounts.
     */
    useEffect(() => {
        setErrorMessage('');
        setIsLoading(true);
        // subscribe to the group's todos collection if a groupId is provided
        if (groupId) {   
            return subscribeToCollection(["groups", groupId, "todos"], handleSnapshot);            
        } else {
            if (uid) {
                return subscribeToCollection(["users", uid, "todos"], handleSnapshot);
            }
        }
    }, [uid, groupId]);


    /**
     * Handles a snapshot of todos from Firestore.
     * @param {Object} snapshot - The snapshot of todos.
     */
    const handleSnapshot = (snapshot) => {
        const updatedTodos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const sortedTodos = sortTodosByDateCreated(updatedTodos);
        setTodos(sortedTodos);
        setIsLoading(false);
    }

    /**
     * Sorts an array of todos by date created.
     * @param {Array} todosData - The array of todos to sort.
     * @returns {Array} The sorted array of todos.
     */
    const sortTodosByDateCreated = (todosData) => {
        todosData.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
        return todosData;
    };

    // return a loading spinner if the component is loading
    if (isLoading || authLoading || loggingOut) {
        return (
            <Card className="todo-card">
                <LoadingSpinner show={true} />
            </Card>
        );
    }
    return (
        <Card className="todo-card">

            <Card.Title className="todo-card-title" style={{ textAlign: 'center', marginBottom: '20px' }}>
                {group ? "Todo List for " + group.name : userName + "'s Todo List"}
                </Card.Title>
            {errorMessage && <Card.Text className='todos-error-message'> {errorMessage} </Card.Text>}
            <Card.Body>
                <ListGroup className='todo-list'>
                    <ListGroup.Item className="todo-item">
                        <NewTodo setErrorMessage={setErrorMessage} groupId={groupId} />
                    </ListGroup.Item>
                    {todos.map((todo) => (
                        <TodoListItem key={todo.id} todo={todo} setErrorMessage={setErrorMessage} groupId={groupId}  />
                    ))}
                </ListGroup>
            </Card.Body>
        </Card>
    );
}

export default TodoList;