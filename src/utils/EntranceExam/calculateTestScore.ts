// utils/EntranceExam/calculateTestScore.js
import mongoose from "mongoose";

interface QuestionData {
  _id: mongoose.Types.ObjectId;
  question: string;
  options: { text: string; isCorrect: boolean }[];
  correctAnswer: string;
  explanation?: string;
}

interface Question {
  question: QuestionData;
  selectedAnswer?: number;
  timeSpent?: number;
  isCorrect?: boolean;
}

interface Answer {
  questionId: string;
  selectedAnswer: number;
  timeSpent: number;
}

export const calculateScore = (questions: Question[], answers: Answer[], passingPercentage = 40) => {
  let score = 0;
  let totalQuestions = questions.length;

  const answerMap = answers.reduce((map: Record<string, { selectedAnswer: number; timeSpent: number }>, answer) => {
    map[answer.questionId] = {
      selectedAnswer: answer.selectedAnswer,
      timeSpent: answer.timeSpent
    };
    return map;
  }, {});

  const correctedAnswers = questions.map((q) => {
    const question = q.question;
    const studentAnswer = answerMap[question._id.toString()];

    const correctOption = question.options.findIndex(opt => opt.text === question.correctAnswer);
    const isCorrect = studentAnswer && studentAnswer.selectedAnswer === correctOption;

    if (isCorrect) {
      score++;
    }

    return {
      ...q,
      selectedAnswer: studentAnswer ? studentAnswer.selectedAnswer : -1,
      timeSpent: studentAnswer ? studentAnswer.timeSpent : 0,
      isCorrect,
      correctAnswer: correctOption,
      explanation: question.explanation
    };
  });

  const percentage = Math.round((score / totalQuestions) * 100);
  const isPassed = percentage >= passingPercentage;

  return {
    score,
    percentage,
    correctedAnswers,
    totalQuestions,
    isPassed
  };
};

