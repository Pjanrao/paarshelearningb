import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | Paarsh E-Learning",

    description:
        "Learn about Paarsh E-Learning, a career-focused learning platform dedicated to providing practical, industry-relevant IT training, personalized learning, real-world project experience, and placement assistance.",

    keywords: [
        "About Paarsh E-Learning",
        "Paarsh E-Learning",
        "IT training institute",
        "IT courses in Nashik",
        "software training institute",
        "practical IT training",
        "1 to 1 learning",
        "IT internship training",
        "live project training",
        "placement assistance",
        "career focused IT training",
    ],

    openGraph: {
        title: "About Paarsh E-Learning | Learn, Build, Grow & Get Placed",

        description:
            "Discover Paarsh E-Learning's mission to empower learners with practical IT skills, personalized learning, real-world projects, expert guidance, and career-focused placement assistance.",

        url: "https://paarshelearning.com/about",

        siteName: "Paarsh E-Learning",

        images: [
            {
                url: "https://paarshelearning.com/images/about-us-og.png",
                width: 1200,
                height: 630,
                alt: "About Paarsh E-Learning - Empowering Learners and Building Successful Careers",
            },
        ],

        locale: "en_US",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",

        title: "About Paarsh E-Learning | Empowering Learners",

        description:
            "Learn how Paarsh E-Learning helps students build career-ready skills through personalized learning, practical training, live projects, and placement assistance.",

        images: [
            "https://paarshelearning.com/images/about-us-og.png",
        ],
    },

    alternates: {
        canonical: "https://paarshelearning.com/about",
    },
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}