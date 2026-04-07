import { NextResponse } from "next/server";
import Question from "@/models/Question";
import PracticeTest from "@/models/PracticeTest";
import Papa from "papaparse";
import { connectDB } from "@/lib/db";

interface CSVRow {
    questionText: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    correctIndex: string | number;
    marks?: string | number;
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();

        const { testId, fileContent, fileType }: { testId: string; fileContent: string; fileType: "json" | "csv" } = data;

        if (!testId) {
            return NextResponse.json({ message: "Test ID is required" }, { status: 400 });
        }

        let rawQuestions: any[] = [];
        if (fileType === "json") {
            const parsedJson = JSON.parse(fileContent);
            rawQuestions = parsedJson.questions || (Array.isArray(parsedJson) ? parsedJson : [parsedJson]);
        } else if (fileType === "csv") {
            const parsedData = Papa.parse<CSVRow>(fileContent, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true,
            });

            if (!Array.isArray(parsedData.data)) {
                throw new Error("Invalid CSV format");
            }
            rawQuestions = parsedData.data;
        }

        if (rawQuestions.length === 0) {
            return NextResponse.json({ message: "No valid questions found" }, { status: 400 });
        }

        const questionsToInsert = rawQuestions.map((q: any) => {
            const options = [
                (q.option1 || "").toString().trim(),
                (q.option2 || "").toString().trim(),
                (q.option3 || "").toString().trim(),
                (q.option4 || "").toString().trim(),
            ];

            return {
                testId,
                questionText: (q.questionText || "").toString().trim(),
                options,
                correctAnswer: parseInt(q.correctIndex || "0"),
                marks: parseInt(q.marks || "1"),
            };
        });

        // Basic validation
        const invalidQuestions = questionsToInsert.filter(q => 
            !q.questionText || 
            q.options.some(opt => !opt) || 
            isNaN(q.correctAnswer) || 
            q.correctAnswer < 0 || 
            q.correctAnswer > 3
        );

        if (invalidQuestions.length > 0) {
            return NextResponse.json({ 
                message: "Invalid question data", 
                details: "Some questions are missing fields or have invalid correct index.",
                count: invalidQuestions.length 
            }, { status: 400 });
        }

        await Question.insertMany(questionsToInsert);

        // Update totalQuestions in PracticeTest
        await PracticeTest.findByIdAndUpdate(testId, {
            $inc: { totalQuestions: questionsToInsert.length }
        });

        return NextResponse.json({
            message: "Questions uploaded successfully",
            success: true,
            count: questionsToInsert.length
        });

    } catch (error: any) {
        console.error("Bulk upload error:", error);
        return NextResponse.json({ message: "Error processing bulk upload", error: error.message }, { status: 500 });
    }
}
