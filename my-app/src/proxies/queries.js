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
        console.log(`Document added to to ${path.join('/')} with ID: ${docRef.id}`);
        // log the formatted path (good for testing rules in Firestore)
        //console.log(`${path.join('/')}/${docRef.id}`);
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
            console.log(`Document data fetched from ${path.join('/')} with ID: ${docSnap.id}`);
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
        console.log(`Document set to ${path.join('/')} with ID: ${path[path.length - 1]}`);
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
        console.log(`Document deleted from ${path.join('/')}`);
    } catch (error) {
        console.error(`Error deleting document from ${path.join('/')}: `, error);
        throw error;
    }
}

/**
 * This function is the unsubscribe function for the onSnapshot listener
 * @param {Array} path - The path to the collection or subcollection. This should be an array of alternating collection names and document IDs
 * @param {function} handleSnapshot - The function to handle the snapshot data
 * @returns {function} The unsubscribe function for the onSnapshot listener
 */
export const subscribeToCollection = (path, handleSnapshot) => {
    return onSnapshot(collection(db, ...path), handleSnapshot);
}

export const subscribeToDocument = (path, handleSnapshot) => {
    return onSnapshot(doc(db, ...path), handleSnapshot);
}


// function that looks up collection and returns an array of the document IDs
export const getCollectionIds = async (path) => {
    try {
        const collectionRef = collection(db, ...path);
        const collectionSnapshot = await collectionRef.get();
        const collectionArray = collectionSnapshot.docs.map(doc => doc.id);
        console.log(`Collection data fetched from ${path.join('/')}`);
        console.log(collectionArray)
        return collectionArray;
    } catch (error) {
        console.error(`Error getting collection from ${path.join('/')}: `, error);
        throw error;
    }
}   