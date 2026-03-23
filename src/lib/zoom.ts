import axios from "axios";

export const getZoomAccessToken = async () => {
    const response = await axios.post(
        `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
        {},
        {
            auth: {
                username: process.env.ZOOM_CLIENT_ID!,
                password: process.env.ZOOM_CLIENT_SECRET!,
            },
        }
    );

    return response.data.access_token;

};

// 🎥 Create Meeting
export const createZoomMeeting = async (data: {
    topic: string;
    startTime: string;
    duration: number;
}) => {
    const token = await getZoomAccessToken();

    const response = await axios.post(
        "https://api.zoom.us/v2/users/me/meetings",
        {
            topic: data.topic,
            type: 2, // scheduled meeting
            start_time: data.startTime,
            duration: data.duration,
            timezone: "Asia/Kolkata",
            settings: {
                join_before_host: false,
                approval_type: 0,
            },
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    return response.data;
};