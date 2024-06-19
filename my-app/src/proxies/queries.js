/**
 * @file        queries.js
 * @description This file is used to define the queries that will be used in the application.
 *              The queries are used to fetch data from firebase.
 * @author      Johnathan Glasgow
 * @date        14/06/2024
 */

import { collection, addDoc, deleteDoc, getDoc, doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.js";

/**
 * This function will add a document to the specified collection or subcollection in the firestore database
 * @param {Array} path - The path to the collection or subcollection. This should be an array of alternating collection names and document IDs
 * @param {Object} document - The data to be added to the collection
 */
export const addDocument = async (path, document) => {
    try {
        const docRef = await addDoc(collection(db, ...path), document);
        return docRef.id;
    } catch (error) {
        console.error(`Error adding document to ${path.join('/')}: `, error);
        throw error;
    }
};

/**
 * This function will get a document from the specified collection or subcollection in the firestore database
 * @param {Array} path - The path to the collection or subcollection. This should be an array of alternating collection names and document IDs
 * @returns {Object} The document fetched from the database
 */
export const getDocument = async (path) => {
    try {
        const docRef = doc(db, ...path);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap;
        } else {
            console.error(`No such document exists in ${path.join('/')}`);
            return null;
        }
    } catch (error) {
        console.error(`Error getting document from ${path.join('/')}: `, error);
        throw error;
    }
}

/**
 * This function will set a document in the specified collection or subcollection in the firestore database
 * Set is used both to create a new document with a specific id and to update an existing document
 * @param {Array} path - The path to the collection or subcollection. This should be an array of alternating collection names and document IDs
 * The last element in the path array should be the document ID. If the document does not exist, it will be created. Otherwise, it will be updated.
 * @param {Object} document - The data to be set in the document
 * @param {Object} options - An optional object to specify options for the set operation. It can have a single property, `merge`, set to true.
 * @default { merge: true } - The default option is to merge the new data with the existing data in the document
 */
export const setDocument = async (path, document, options = { merge: true }) => {
    try {
        await setDoc(doc(db, ...path), document, options);
    } catch (error) {
        console.error(`Error setting document to ${path.join('/')}: `, error);
        throw error;
    }
};

/**
 * This function deletes a document from the firestore database
 * @param {Array} path - The path to the document to be deleted
 */
export const deleteDocument = async (path) => {
    try {
        await deleteDoc(doc(db, ...path));
    } catch (error) {
        console.error(`Error deleting document from ${path.join('/')}: `, error);
        throw error;
    }
}

/**
 * Subscribe to a collection or subcollection in the firestore database
 * 
 * @param {Array} path - The path to the collection or subcollection. This should be an array of alternating collection names and document IDs
 * @param {function} handleSnapshot - The function to handle the snapshot data
 * @returns {function} The unsubscribe function for the onSnapshot listener
 */
export const subscribeToCollection = (path, handleSnapshot) => {
    return onSnapshot(collection(db, ...path), handleSnapshot);
}

/**
 * Subscribe to a document in the firestore database
 * 
 * @param {Array} path - The path to the document to subscribe to
 * @param {function} handleSnapshot - The function to handle the snapshot data
 * @returns {function} The unsubscribe function for the onSnapshot listener
 */
export const subscribeToDocument = (path, handleSnapshot) => {
    return onSnapshot(doc(db, ...path), handleSnapshot);
}

/**
 * Get the IDs of all the documents in a collection
 * 
 * @param {Array} path - The path to the collection
 * @returns {Array} An array of document IDs
 */
export const getCollectionIds = async (path) => {
    try {
        const collectionRef = collection(db, ...path);
        const collectionSnapshot = await collectionRef.get();
        const collectionArray = collectionSnapshot.docs.map(doc => doc.id);
        return collectionArray;
    } catch (error) {
        console.error(`Error getting collection from ${path.join('/')}: `, error);
        throw error;
    }
}   