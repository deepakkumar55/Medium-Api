import { writeFileSync } from 'fs';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function fetchMediumAccountDetails() {
    try {
        // Fetching Medium account details
        const meResponse = await axios.get('https://api.medium.com/v1/me', {
            headers: {
                Authorization: `Bearer ${process.env.MEDIUM_ACCESS_TOKEN}`
            }
        });

        console.log('Me Response:', meResponse.data);

        const userId = meResponse.data.data.id;

        // Fetching publications
        const publicationsResponse = await axios.get(`https://api.medium.com/v1/users/${userId}/publications`, {
            headers: {
                Authorization: `Bearer ${process.env.MEDIUM_ACCESS_TOKEN}`
            }
        });

        // Check if publications are available
        if (!publicationsResponse.data || !publicationsResponse.data.data || publicationsResponse.data.data.length === 0) {
            console.error('No publications found for the user');
            return;
        }
        console.log('Publications Response:', publicationsResponse.data);

        const publicationId = publicationsResponse.data.data[0].id;
        // Fetching contributors of the first publication
        const contributorsResponse = await axios.get(`https://api.medium.com/v1/publications/${publicationId}/contributors`, {
            headers: {
                Authorization: `Bearer ${process.env.MEDIUM_ACCESS_TOKEN}`
            }
        });

        console.log('contributorsResponse Response:', contributorsResponse.data);

        // Creating a new post under the user
        const createPostResponse = await axios.post(`https://api.medium.com/v1/users/${userId}/posts`, {
            title: 'New Post',
            contentFormat: 'markdown',
            content: 'Hello, World!',
            publishStatus: 'public'
        }, {
            headers: {
                Authorization: `Bearer ${process.env.MEDIUM_ACCESS_TOKEN}`
            }
        });
        console.log('Create Post Response:', createPostResponse.data);

        // Creating a new post under the publication
        const createPublicationPostResponse = await axios.post(`https://api.medium.com/v1/publications/${publicationId}/posts`, {
            title: 'New Publication Post',
            contentFormat: 'markdown',
            content: 'Hello, Publication!',
            publishStatus: 'public'
        }, {
            headers: {
                Authorization: `Bearer ${process.env.MEDIUM_ACCESS_TOKEN}`
            }
        });
        console.log('Create Publication Post Response:', createPublicationPostResponse.data)


        // Uploading an image
        const uploadImageResponse = await axios.post('https://api.medium.com/v1/images', {
            /* Image data here */
        }, {
            headers: {
                Authorization: `Bearer ${process.env.MEDIUM_ACCESS_TOKEN}`
            }
        });

        console.log('Upload Image Response:', uploadImageResponse.data);

        // Extracting necessary details
        const mediumDetails = {
            me: meResponse.data.data,
            publications: publicationsResponse.data.data,
            contributors: contributorsResponse.data.data,
            newPost: createPostResponse.data.data,
            newPublicationPost: createPublicationPostResponse.data.data,
            uploadedImage: uploadImageResponse.data.data
        };

        // Writing details to a JSON file
        writeFileSync('medium_account_details.json', JSON.stringify(mediumDetails, null, 2));
        console.log('Medium account details saved to medium_account_details.json');
    } catch (error) {
        console.error('Error fetching Medium account details:', error.message);
    }
}

fetchMediumAccountDetails();
