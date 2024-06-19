/**
 * @jest-environment jsdom
 */

import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing"
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import { readFileSync } from 'fs';
import 'setimmediate';

let testEnv;
let db;
let userId;

beforeAll(async () => {
    try {
        testEnv = await initializeTestEnvironment({
            projectId: "veryfunpokergame",
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

it('auth user can read/write their own documents', async () => {
    const myDoc = { name: "Test doc" };

    // attempt to add a document as an authenticated user
    await assertSucceeds(addDoc(collection(db, 'users', userId, 'users-stuff'), myDoc));

    // check it can be accessed
    const docs = await getDocs(collection(db, 'users', userId, 'users-stuff'));
    expect(docs.docs.map(doc => doc.data())).toContainEqual(myDoc);
});

it('auth user fails to read/write to another users documents', async () => {
    const myDoc = { name: "Test doc" };

    // attempt to read from another users collection
    await assertFails(getDocs(collection(db, 'users', "some-other-ID", 'users-stuff')));
    
    // attempt to write to another users collection
    await assertFails(addDoc(collection(db, 'users', "some-other-ID", 'users-stuff'), myDoc));
});

it('auth user can read, create, update games but cannot delete if not a player', async () => {
    const myGame = { name: "Test game" };
    const gameDoc = doc(db, 'games', 'game_1');

    // attempt to read, create, update games
    await assertSucceeds(getDocs(collection(db, 'games')));
    await assertSucceeds(setDoc(gameDoc, myGame));
    await assertSucceeds(updateDoc(gameDoc, { name: "Updated game" }));

    // attempt to delete game
    await assertFails(deleteDoc(gameDoc));
});

it('auth user can read, create, update, delete their own player document', async () => {
    const myPlayer = { name: "Test player" };
    const playerDoc = doc(db, 'games', 'game_1', 'players', userId);

    // attempt to read, create, update player document
    await assertSucceeds(getDocs(collection(db, 'games', 'game_1', 'players')));
    await assertSucceeds(setDoc(playerDoc, myPlayer));
    await assertSucceeds(updateDoc(playerDoc, { name: "Updated player" }));

    // attempt to delete own player document
    await assertSucceeds(deleteDoc(playerDoc));
});

afterAll(async () => {
    // Close any lingering connections to the Firestore emulator
    await testEnv.cleanup();
});