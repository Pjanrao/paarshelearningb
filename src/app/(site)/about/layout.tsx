import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About | Paarsh E - Learning",
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
