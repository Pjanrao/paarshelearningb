import { notFound } from "next/navigation";
import WorkshopDetailContent from "./WorkshopDetailContent";
import { connectDB } from "@/lib/db";
import Workshop from "@/models/Workshop";

export const dynamic = "force-dynamic";

type Props = {
    params: Promise<{ id: string }>;
};

const WorkshopDetailPage = async ({ params }: Props) => {
    const { id } = await params;
    
    // 1. Try fetching from Database first
    let workshop: any = null;
    try {
        await connectDB();
        workshop = await Workshop.findById(id);
    } catch (err) {
        console.error("DB Fetch error in workshop details:", err);
    }

    if (workshop) {
        // Map DB fields to the expected WorkshopData type
        const mappedWorkshop = {
            title: workshop.title,
            subtitle: workshop.subtitle || workshop.description?.substring(0, 150) + "...",
            promoImage: workshop.promoImage || workshop.thumbnail || "/promo1.png",
            qrImage: workshop.qrImage || "/qr-data-science.jpeg", // Default QR if missing
            date: workshop.date || "TBD",
            time: workshop.time || "TBD",
            highlights: workshop.highlights && workshop.highlights.length > 0 
                ? workshop.highlights 
                : ["Expert-led session", "Practical lab", "Live Q&A", "Community Access"],
            agenda: workshop.agenda?.length > 0 ? workshop.agenda : [
                { time: workshop.time || "TBA", activity: "Main Session & Workshop" }
            ],
            instructions: workshop.instructions?.length > 0 ? workshop.instructions : [
                "Carry a laptop if possible",
                "Bring ID card for verification",
                "Maintain professional discipline"
            ],
            brochurePdf: workshop.brochurePdf || "#",
            description: workshop.description || "",
            mode: workshop.mode || "online",
            location: workshop.location || ""
        };
        return <WorkshopDetailContent workshop={mappedWorkshop} />;
    }

    notFound();
};



export default WorkshopDetailPage;
