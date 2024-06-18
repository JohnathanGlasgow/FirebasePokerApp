//  get  a random userName from https://randomuser.me

export const getRandomUser = async () => {
    try {
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();
        console.log(data.results[0].name.first);
        return data.results[0].name.first;
    } catch (error) {
        console.error('Error getting random user: ', error);
    }
}