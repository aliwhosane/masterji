import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizTabProps {
  quiz: QuizQuestion[] | null;
  documentId: string;
  isGenerating: boolean;
  onGenerate: () => void;
  documentStatus: string;
}

const QuizTab: React.FC<QuizTabProps> = ({
  quiz,
  documentId,
  isGenerating,
  onGenerate,
  documentStatus,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      {quiz && quiz.length > 0 ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Quiz</h2>
            <div className="space-x-2">
              <button
                onClick={() => navigate(`/quiz/${documentId}`)}
                className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded"
              >
                Start Quiz
              </button>
              <button
                onClick={onGenerate}
                disabled={isGenerating || documentStatus !== 'succeeded'}
                className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <span className="flex items-center">
                    <LoadingSpinner size="small" />
                    Regenerating...
                  </span>
                ) : (
                  'Regenerate Quiz'
                )}
              </button>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            This quiz contains {quiz.length} questions based on your document.
            Click "Start Quiz" to test your knowledge.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-700">
              <span className="font-medium">Preview:</span> {quiz[0].question}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No quiz available yet.</p>
          <button
            onClick={onGenerate}
            disabled={isGenerating || documentStatus !== 'succeeded'}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center">
                <LoadingSpinner size="medium" />
                Generating Quiz...
              </span>
            ) : (
              'Generate Quiz'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizTab;