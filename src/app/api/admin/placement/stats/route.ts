import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Placement from "@/models/Placement";

export async function GET() {
    try {
        await connectDB();

        const totalPlaced = await Placement.countDocuments({ status: "Placed" });
        const partnerCompanies = await Placement.distinct("company").then(cos => cos.length);
        const activeDrives = await Placement.countDocuments({ status: "Pending" }); // Just an example, maybe active means interviewing?

        const placements = await Placement.find({ status: "Placed" });
        let totalPackage = 0;
        placements.forEach(p => {
            const val = parseFloat(p.package.replace(/[^\d.]/g, ''));
            if (!isNaN(val)) totalPackage += val;
        });
        const avgPackage = placements.length > 0 ? (totalPackage / placements.length).toFixed(1) : "0";

        const stats = [
            { title: "Total Placed", value: totalPlaced.toString(), color: "blue" },
            { title: "Partner Companies", value: partnerCompanies.toString() + "+", color: "indigo" },
            { title: "Avg. Package", value: avgPackage + " LPA", color: "emerald", trend: "Latest placement: " + (placements[0]?.package || "N/A") },
            { title: "Active Drives", value: activeDrives.toString(), color: "amber" }
        ];

        return NextResponse.json(stats);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
