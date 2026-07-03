import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us | Paarsh E-Learning",

    description:
        "Contact Paarsh E-Learning for information about IT courses, personalized 1:1 learning, practical training, live projects, internship opportunities, and placement assistance. Call us at +91 90752 01035.",

    keywords: [
        "Contact Paarsh E-Learning",
        "Paarsh E-Learning contact number",
        "IT training institute Nashik",
        "IT courses in Nashik",
        "software training institute Nashik",
        "IT course enquiry",
        "1 to 1 IT learning",
        "IT internship opportunities",
        "placement assistance",
        "practical IT training",
    ],

    openGraph: {
        title: "Contact Paarsh E-Learning | Start Your Tech Career",

        description:
            "Have questions about our IT courses and career programs? Connect with Paarsh E-Learning for personalized 1:1 learning, practical training, live projects, internships, and placement assistance.",

        url: "https://paarshelearning.com/contact",

        siteName: "Paarsh E-Learning",

        images: [
            {
                url: "https://paarshelearning.com/images/contact-og.png",
                width: 1200,
                height: 630,
                alt: "Contact Paarsh E-Learning - Call +91 90752 01035",
            },
        ],

        locale: "en_US",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",

        title: "Contact Paarsh E-Learning | We're Here to Help",

        description:
            "Connect with Paarsh E-Learning for IT course enquiries, personalized learning, practical training, internships, and placement assistance.",

        images: [
            "https://paarshelearning.com/images/contact-og.png",
        ],
    },

    alternates: {
        canonical: "https://paarshelearning.com/contact",
    },
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}