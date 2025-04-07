import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuiz } from '../store/slices/quizSlice';
import { RootState } from '../store';

const QuizPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const dispatch = useDispatch();
  const quiz = useSelector((state: RootState) => state.quiz.quiz);
  const quizStatus = useSelector((state: RootState) => state.quiz.status);
  const quizError = useSelector((state: RootState) => state.quiz.error);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  useEffect(() => {
    if (quizStatus === 'idle') {
      if (documentId) {
        dispatch(fetchQuiz(documentId ));
      }
    }
  }, [dispatch, documentId, quizStatus]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    if (quiz && option === quiz[currentQuestionIndex].correctAnswer) {
      setCorrectCount(correctCount + 1);
    } else {
      setIncorrectCount(incorrectCount + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const currentQuestion = quiz?.[currentQuestionIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-black text-2xl font-bold mb-4">Quiz for Document {documentId}</h1>
      {quizStatus === 'loading' && <p>Loading quiz...</p>}
      {quizStatus === 'failed' && <p>Error: {quizError}</p>}
      {quiz && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{currentQuestion?.question}</h2>
          <div className="space-y-4">
            {currentQuestion?.options?.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  selectedOption
                    ? option === currentQuestion.correctAnswer
                      ? 'bg-green-500 text-white'
                      : option === selectedOption
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                disabled={!!selectedOption}
              >
                {option}
              </button>
            ))}
          </div>
          {selectedOption && (
            <button
              onClick={handleNextQuestion}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Next Question
            </button>
          )}
        </div>
      )}
      <div className="mt-8">
        <p className="text-lg">Correct: {correctCount}</p>
        <p className="text-lg">Incorrect: {incorrectCount}</p>
      </div>
    </div>
  );
};

export default QuizPage;