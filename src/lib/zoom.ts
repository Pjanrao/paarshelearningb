import axios from "axios";

export const getZoomAccessToken = async () => {
    const response = await axios.post(
        "https://zoom.us/oauth/token",
        null,
        {
            params: {
                grant_type: "account_credentials",
                account_id: process.env.ZOOM_ACCOUNT_ID,
            },
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
    try {
        const token = await getZoomAccessToken();

        console.log("✅ TOKEN:", token);
        console.log("✅ START TIME:", data.startTime);

        const response = await axios.post(
            "https://api.zoom.us/v2/users/me/meetings",
            {
                topic: data.topic,
                type: 2,
                start_time: data.startTime,
                duration: Number(data.duration),
                timezone: "Asia/Kolkata",
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;

    } catch (error: any) {
        console.error("❌ FULL ERROR:", error);
        console.error("❌ ZOOM ERROR:", error.response?.data); // 🔥 IMPORTANT
        throw error;
    }
};