import { NextResponse } from 'next/server';
import { authMiddleware } from '@/middlewares/auth';
import Test from '@/models/EntranceExam/Test.model';
import _db from '@/utils/db';

export const GET = authMiddleware(async function (request: Request) {
    try {
        await _db();
        const { searchParams } = new URL(request.url);
        const collegeId = searchParams.get("collegeId");

        if (!collegeId) {
            return NextResponse.json(
                { success: false, message: "College ID is required" },
                { status: 400 }
            );
        }

        const batches = await Test.distinct('batchName', { college: collegeId });

        if (!batches || batches.length === 0) {
            return NextResponse.json({
                success: true,
                batches: []
            });
        }

        return NextResponse.json({
            success: true,
            batches: batches.sort()
        });
    } catch (error: unknown) {
        console.error("Error fetching batches:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "An unknown error occurred"
            },
            { status: 500 }
        );
    }
}, ["admin"]); 
