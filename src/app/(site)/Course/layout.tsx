import type { Metadata } from "next";

export const metadata: Metadata = {
    title:
        "IT Courses & Professional Training | Paarsh E-Learning",

    description:
        "Explore industry-focused IT and professional courses at Paarsh E-Learning, including Cyber Security, Programming, Web Development, Data Science, Data Analytics, Artificial Intelligence, UI/UX Design, Digital Marketing, and Project Management. Get personalized 1:1 learning, practical training, live project experience, and placement assistance.",

    keywords: [
        "IT courses",
        "online IT courses",
        "Cyber Security course",
        "Programming courses",
        "Web Development course",
        "Data Science course",
        "Data Analytics course",
        "Artificial Intelligence course",
        "AI course",
        "UI UX Design course",
        "Digital Marketing course",
        "Project Management course",
        "1 to 1 learning",
        "personalized IT training",
        "IT courses with placement assistance",
        "Paarsh E-Learning",
    ],

    openGraph: {
        title:
            "Explore IT & Professional Courses | Paarsh E-Learning",

        description:
            "Build job-ready skills with courses in Cyber Security, Programming, Web Development, Data Science, Data Analytics, AI, UI/UX Design, Digital Marketing, Project Management, and more. Learn with personalized 1:1 training, practical projects, and placement assistance.",

        url: "https://paarshelearning.com/course",

        siteName: "Paarsh E-Learning",

        images: [
            {
                url: "https://paarshelearning.com/images/course-og.png",
                width: 1200,
                height: 630,
                alt: "IT and Professional Courses at Paarsh E-Learning",
            },
        ],

        type: "website",
    },

    twitter: {
        card: "summary_large_image",

        title:
            "IT Courses & Career-Focused Training | Paarsh E-Learning",

        description:
            "Learn Cyber Security, Programming, Web Development, Data Science, Data Analytics, AI, UI/UX, Digital Marketing, Project Management, and more with 1:1 learning and placement assistance.",

        images: [
            "https://paarshelearning.com/images/course-og.png",
        ],
    },

    alternates: {
        canonical: "https://paarshelearning.com/course",
    },
};

export default function CourseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}