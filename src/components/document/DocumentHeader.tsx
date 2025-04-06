import React from 'react';

interface DocumentHeaderProps {
  filename: string;
  uploadedAt: string;
  status: string;
  onDelete: () => void;
}

const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  filename,
  uploadedAt,
  status,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusClasses = (status: string) => {
    switch(status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-gray-200">
      <div className="mb-4 sm:mb-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">{filename}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Uploaded on {formatDate(uploadedAt)}
        </p>
        <div className="mt-2">
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(status)}`}>
            {status}
          </span>
        </div>
      </div>
      <div>
        <button
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
};

export default DocumentHeader;