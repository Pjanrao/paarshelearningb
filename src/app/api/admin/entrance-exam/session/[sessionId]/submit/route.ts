import { NextResponse } from 'next/server';
import TestSession from '@/models/EntranceExam/TestSession.model';
import Student from '@/models/EntranceExam/Student.model';
import Question from '@/models/EntranceExam/Question.model';
import { calculateScore } from '@/utils/EntranceExam/calculateTestScore';
import _db from '@/utils/db';
import { authMiddleware } from '@/middlewares/auth';

export const POST = authMiddleware(async function (request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
    try {
        await _db();
        const { sessionId: bodySessionId, answers } = await request.json();
        const { sessionId: paramSessionId } = await params;
        const sessionId = paramSessionId || bodySessionId;

        if (!Array.isArray(answers) || !answers.every(a =>
            typeof a === 'object' &&
            'questionId' in a &&
            'selectedAnswer' in a &&
            'timeSpent' in a
        )) {
            return NextResponse.json(
                { success: false, message: 'Invalid answers format' },
                { status: 400 }
            );
        }

        const session = await TestSession.findById(sessionId).populate({
            path: 'questions.question',
            model: Question,
            select: 'question options correctAnswer explanation'
        });

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Test session not found' },
                { status: 404 }
            );
        }

        if (session.status === 'completed') {
            return NextResponse.json(
                { success: false, message: 'Test has already been submitted' },
                { status: 400 }
            );
        }

        const { score, percentage, correctedAnswers, isPassed } = calculateScore(
            session.questions,
            answers,
            session.passingPercentage
        );

        session.questions = correctedAnswers;
        session.endTime = new Date();
        session.score = score;
        session.percentage = percentage;
        session.status = 'completed';
        session.isPassed = isPassed;

        await session.save();

        await Student.findByIdAndUpdate(session.student, {
            testStatus: 'completed',
            testEndTime: new Date(),
            lastTestScore: score,
            lastTestPercentage: percentage,
            lastTestPassed: isPassed
        });

        const formattedAnswers = (correctedAnswers as any[]).map(answer => {
            const questionData = answer.question || {};

            return {
                questionId: questionData._id?.toString() || (answer._id?.toString() || ""),
                question: questionData.question || '',
                selectedAnswer: answer.selectedAnswer,
                correctAnswer: answer.correctAnswer,
                isCorrect: answer.isCorrect,
                explanation: questionData.explanation || '',
                timeSpent: answer.timeSpent || 0
            };
        });

        return NextResponse.json({
            success: true,
            score,
            percentage,
            totalQuestions: session.questions.length,
            isPassed,
            correctedAnswers: formattedAnswers,
            message: isPassed ? 'Congratulations! You have passed the test.' : 'Unfortunately, you did not pass the test.'
        });
    } catch (error: unknown) {
        console.error('Error in test submission:', error);
        return NextResponse.json(
            { success: false, message: error instanceof Error ? error.message : 'An error occurred while submitting the test' },
            { status: 500 }
        );
    }
}, ["entrance_student"]);
