import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

interface Question {
  question: string;
  answer: string;
}

interface QaTabProps {
  questions: Question[] | null;
  isGenerating: boolean;
  onGenerate: () => void;
  documentStatus: string;
}

const QaTab: React.FC<QaTabProps> = ({
  questions,
  isGenerating,
  onGenerate,
  documentStatus,
}) => {
  return (
    <div>
      {questions && questions.length > 0 ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Questions & Answers</h2>
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
                'Regenerate Q&A'
              )}
            </button>
          </div>
          {questions.map((qa, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-black font-medium text-lg mb-2">Q: {qa.question}</h3>
              <p className="text-gray-700">A: {qa.answer}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No Q&A available yet.</p>
          <button
            onClick={onGenerate}
            disabled={isGenerating || documentStatus !== 'succeeded'}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center">
                <LoadingSpinner size="medium" />
                Generating Q&A...
              </span>
            ) : (
              'Generate Q&A'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default QaTab;