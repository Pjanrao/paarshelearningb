import { NextResponse } from "next/server";
import Question from "@/models/EntranceExam/Question.model";
import Papa from "papaparse";
import _db from "@/utils/db";

interface Option {
    text: string;
    isCorrect: boolean;
}

interface IncomingQuestion {
    question: string;
    options: Option[];
    correctAnswer: string;
    category: string;
    explanation?: string;
    isActive?: boolean;
}

interface CSVRow {
    question: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    correctAnswer: string;
    category: string;
    explanation?: string;
}

export async function POST(req: Request) {
    try {
        await _db();
        const data = await req.json();

        // Support both { questions: [...] } and { fileContent, fileType }
        let rawQuestions: any[] = [];
        if (data.questions && Array.isArray(data.questions)) {
            rawQuestions = data.questions;
        } else {
            const { fileContent, fileType }: { fileContent: string, fileType: "json" | "csv" } = data;
            if (fileType === "json") {
                const parsedJson = JSON.parse(fileContent);
                rawQuestions = parsedJson.questions || (Array.isArray(parsedJson) ? parsedJson : [parsedJson]);
            } else if (fileType === "csv") {
                const parsedData = Papa.parse<CSVRow>(fileContent, {
                    header: true,
                    skipEmptyLines: true
                });

                if (!Array.isArray(parsedData.data)) {
                    throw new Error("Invalid CSV format");
                }
                rawQuestions = parsedData.data;
            }
        }

        const validCategories = ["aptitude", "logical", "quantitative", "verbal", "technical"];

        const questions: IncomingQuestion[] = rawQuestions
            .filter(q => q.question || q.Question)
            .map((q: any) => {
                // Handle different field naming conventions (case-insensitive)
                const questionText = (q.question || q.Question || "").toString().trim();
                const correctAnswer = (q.correctAnswer || q.CorrectAnswer || "").toString().trim();
                const explanation = (q.explanation || q.Explanation || "").toString().trim();

                // Handle options provided as string array or individual fields
                let options: Option[] = [];
                if (Array.isArray(q.options)) {
                    options = q.options.map((opt: any) => {
                        if (typeof opt === 'string') {
                            return { text: opt.trim(), isCorrect: opt.trim() === correctAnswer };
                        }
                        return { text: opt.text?.toString().trim(), isCorrect: !!opt.isCorrect };
                    });
                } else if (q.option1 || q.OptionA) {
                    // Map from CSV/Excel fields
                    const optA = (q.option1 || q.OptionA || "").toString().trim();
                    const optB = (q.option2 || q.OptionB || "").toString().trim();
                    const optC = (q.option3 || q.OptionC || "").toString().trim();
                    const optD = (q.option4 || q.OptionD || "").toString().trim();

                    options = [
                        { text: optA, isCorrect: optA === correctAnswer },
                        { text: optB, isCorrect: optB === correctAnswer },
                        { text: optC, isCorrect: optC === correctAnswer },
                        { text: optD, isCorrect: optD === correctAnswer }
                    ].filter(o => o.text);
                }

                // Category mapping and defaulting
                let category = (q.category || q.Category || "aptitude").toLowerCase().trim();
                if (category === "reasoning" || category === "logic") category = "logical";
                if (category === "math" || category === "mathematics" || category === "quant") category = "quantitative";
                if (category === "english") category = "verbal";
                if (!validCategories.includes(category)) category = "aptitude";

                return {
                    question: questionText,
                    options,
                    correctAnswer: correctAnswer,
                    category,
                    explanation,
                    isActive: true
                };
            });

        if (questions.length === 0) {
            return NextResponse.json(
                { message: "No valid questions found in payload" },
                { status: 400 }
            );
        }

        // Final validation before DB insertion
        const invalidQuestions = questions.filter(q =>
            !q.question ||
            q.options.length < 2 ||
            !q.options.some(opt => opt.isCorrect)
        );

        if (invalidQuestions.length > 0) {
            return NextResponse.json(
                {
                    message: "Invalid question format",
                    details: "Some questions are missing required fields or correct answers",
                    count: invalidQuestions.length
                },
                { status: 400 }
            );
        }

        await Question.insertMany(questions);

        return NextResponse.json({
            message: "Questions added successfully",
            success: true,
            count: questions.length
        });

    } catch (error: unknown) {
        console.error("Error in bulk upload:", error);
        return NextResponse.json(
            {
                message: "Error processing bulk upload",
                error: error instanceof Error ? error.message : "Internal Server Error"
            },
            { status: 500 }
        );
    }
}

