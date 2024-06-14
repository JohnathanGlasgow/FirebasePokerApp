/**
 * @jest-environment jsdom
 */

import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing"
import { collection, addDoc, getDocs } from "firebase/firestore";
import { readFileSync } from 'fs';
import 'setimmediate';

let testEnv;
let db;
let userId;

beforeAll(async () => {
    try {
        testEnv = await initializeTestEnvironment({
            projectId: "todo-app-5b35b",
            firestore: {
                rules: readFileSync("firestore.rules", "utf-8"),
            },
            hub: {
                host: "localhost",
                port: 4400,
            },
        });
        userId = "test-ID";
        db = testEnv.authenticatedContext(userId).firestore();
    } catch (error) {
        console.error('Failed to initialize test environment:', error);
    }
});

it('adds a document to an auth users collection and retrieves it', async () => {
    const myDoc = { name: "Test doc" };

    // attempt to add a document as an authenticated user
    await assertSucceeds(addDoc(collection(db, 'users', userId, 'users-stuff'), myDoc));

    // check it can be accessed
    const docs = await getDocs(collection(db, 'users', userId, 'users-stuff'));
    expect(docs.docs.map(doc => doc.data())).toContainEqual(myDoc);
}
);

it('auth user fails to read/write to another users collection', async () => {
    const myDoc = { name: "Test doc" };

    // attempt to read from another users collection
    await assertFails(getDocs(collection(db, 'users', "some-other-ID", 'users-stuff')));
    
    // attempt to write to another users collection
    await assertFails(addDoc(collection(db, 'users', "some-other-ID", 'users-stuff'), myDoc));
}
);

it('fails to add a document to an unauth users collection and fails to read the collection', async () => {
    const myDoc = { name: "Test doc" };
    const unauthDb = testEnv.unauthenticatedContext().firestore();

    // Attempt to add a document as an unauthenticated user
    await assertFails(addDoc(collection(unauthDb, 'users', userId, 'users-stuff'), myDoc));

    // assert a read operation fails
    await assertFails(getDocs(collection(unauthDb, 'users', userId, 'users-stuff')));
}
);

afterAll(async () => {
    // Close any lingering connections to the Firestore emulator
    await testEnv.cleanup();
  });