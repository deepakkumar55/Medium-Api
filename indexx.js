import { writeFileSync } from 'fs';
import  get  from 'axios';
import dotenv from 'dotenv'
import { log } from 'console';

dotenv.config()

async function fetchMediumAccountDetails() {
    try {
        const response = await get('https://api.medium.com/v1/me', {
            headers: {
                Authorization: `Bearer ${process.env.MEDIUM_ACCESS_TOKEN}`
            }
        });

        // Extracting necessary details
        const mediumDetails = {
            id: response.data.data.id,
            username: response.data.data.username,
            name: response.data.data.name,
            url: response.data.data.url,
            publications: response.data.data
        };
        console.log(mediumDetails);

        

        // Writing details to a JSON file
        writeFileSync('medium_account_details.json', JSON.stringify(mediumDetails, null, 2));
        console.log('Medium account details saved to medium_account_details.json');
    } catch (error) {
        console.error('Error fetching Medium account details:', error.message);
    }
}

fetchMediumAccountDetails();
