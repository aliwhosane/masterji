import { useState } from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizPlayerProps {
  questions: QuizQuestion[];
  onComplete?: (score: number, totalQuestions: number) => void;
}

const QuizPlayer = ({ questions, onComplete }: QuizPlayerProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleOptionSelect = (option: string) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(option);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;

    setIsAnswerSubmitted(true);
    
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setQuizCompleted(true);
      if (onComplete) {
        onComplete(score, totalQuestions);
      }
    } else {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Quiz Completed!</h2>
        <div className="text-center mb-8">
          <p className="text-lg mb-2">Your score:</p>
          <p className="text-3xl font-bold text-blue-600">{score} / {totalQuestions}</p>
          <p className="mt-2 text-gray-600">
            {score === totalQuestions 
              ? 'Perfect score! Excellent work!' 
              : score >= totalQuestions * 0.7 
                ? 'Great job! You did well.' 
                : 'Keep studying to improve your score.'}
          </p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleRestartQuiz}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-medium text-gray-500">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
        <span className="text-sm font-medium text-blue-600">
          Score: {score}
        </span>
      </div>

      <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>

      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => (
          <div 
            key={index}
            onClick={() => handleOptionSelect(option)}
            className={`p-3 border rounded-md cursor-pointer transition-colors ${
              selectedOption === option
                ? isAnswerSubmitted
                  ? option === currentQuestion.correctAnswer
                    ? 'bg-green-100 border-green-500'
                    : 'bg-red-100 border-red-500'
                  : 'bg-blue-100 border-blue-500'
                : isAnswerSubmitted && option === currentQuestion.correctAnswer
                  ? 'bg-green-100 border-green-500'
                  : 'hover:bg-gray-50 border-gray-300'
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className={`w-5 h-5 border rounded-full flex items-center justify-center ${
                  selectedOption === option ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
                }`}>
                  {selectedOption === option && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
              <div className="ml-3">
                <span className={`${selectedOption === option ? 'font-medium' : ''}`}>
                  {option}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAnswerSubmitted ? (
        <div className="mb-4 p-3 rounded-md bg-blue-50 border border-blue-200">
          <p className="font-medium text-blue-800">
            {selectedOption === currentQuestion.correctAnswer 
              ? 'Correct! Well done.' 
              : `Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`}
          </p>
        </div>
      ) : null}

      <div className="flex justify-between">
        {!isAnswerSubmitted ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedOption === null}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPlayer;