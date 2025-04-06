import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

interface SummaryTabProps {
  summary: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
  documentStatus: string;
}

const SummaryTab: React.FC<SummaryTabProps> = ({
  summary,
  isGenerating,
  onGenerate,
  documentStatus,
}) => {
  if (isGenerating) {
    return (
      <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Document Summary</h2>
        </div>
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
          <LoadingSpinner size="large" color="primary" />
          <p className="mt-4 text-gray-600">Generating summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {summary ? (
        <div className="prose max-w-none">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl font-semibold mb-2 sm:mb-0">Document Summary</h2>
            <button
              onClick={onGenerate}
              disabled={documentStatus !== 'succeeded'}
              className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Regenerate
            </button>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="whitespace-pre-line text-gray-700 leading-relaxed">{summary}</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 mb-4">No summary available yet.</p>
          <button
            onClick={onGenerate}
            disabled={documentStatus !== 'succeeded'}
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-200 flex items-center mx-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Generate Summary
          </button>
        </div>
      )}
    </div>
  );
};

export default SummaryTab;