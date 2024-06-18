/**
 * @file        randomUser.js
 * @description This file is used to get a random userName from https://randomuser.me
 *              The random name is then used as a display name for anonymous users
 * @author      Johnathan Glasgow
 * @date        17/06/2024
 */

/**
 * This function fetches a random user name from the randomuser.me API.
 * 
 * @returns {Promise<string>} A Promise that resolves with a random user name.
 */
export const getRandomUser = async () => {
    try {
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();

        return data.results[0].name.first;
    } catch (error) {
        console.error('Error getting random user: ', error);
    }
}