const fs = require('fs');
const path = require('path');
const axios = require('axios');
const formData = require('form-data');

async function testUpload() {
    const filePath = path.join(__dirname, 'test_video.mp4');
    
    // Create a dummy video file if it doesn't exist
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, 'dummy video data');
    }

    const form = new formData();
    form.append('title', 'Test Video');
    form.append('description', 'Test Description');
    form.append('courseId', '64f8a12c9a'); // Example courseId from user request
    form.append('topic', 'Module 1');
    form.append('subtopic', 'Intro');
    form.append('file', fs.createReadStream(filePath), {
        filename: 'test_video.mp4',
        contentType: 'video/mp4'
    });

    try {
        console.log('Sending upload request to http://localhost:3000/api/videos...');
        const response = await axios.post('http://localhost:3000/api/videos', form, {
            headers: form.getHeaders(),
        });

        console.log('Upload successful!');
        console.log('Response:', response.data);
        console.log('Stored URL:', response.data.url);
        
        // Verify file exists on disk
        const storedPath = path.join(process.cwd(), 'public', response.data.url);
        if (fs.existsSync(storedPath)) {
            console.log('Verification: File exists on disk at', storedPath);
        } else {
            console.error('Verification: File NOT found on disk at', storedPath);
        }

    } catch (error) {
        console.error('Upload failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Message:', error.message);
        }
    } finally {
        // Cleanup dummy file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
}

testUpload();
