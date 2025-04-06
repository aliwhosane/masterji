import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { uploadDocument, fetchUserDocuments, resetUploadStatus } from '../store/slices/documentSlice';

const DocumentUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const dispatch = useAppDispatch();
  const { uploadStatus, uploadError } = useAppSelector((state) => state.documents);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      await dispatch(uploadDocument(formData)).unwrap();
      // Reset form
      setFile(null);
      if (e.target instanceof HTMLFormElement) {
        e.target.reset();
      }
      // Refresh document list
      dispatch(fetchUserDocuments());
      // Reset upload status after a delay
      setTimeout(() => {
        dispatch(resetUploadStatus());
      }, 3000);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload New Document</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="document">
            Select Document
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="document"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: PDF, DOC, DOCX, TXT
          </p>
        </div>
        
        {uploadError && (
          <div className="mb-4 text-red-500 text-sm">
            {uploadError}
          </div>
        )}
        
        {uploadStatus === 'succeeded' && (
          <div className="mb-4 text-green-500 text-sm">
            Document uploaded successfully!
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300"
            type="submit"
            disabled={!file || uploadStatus === 'loading'}
          >
            {uploadStatus === 'loading' ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              'Upload Document'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentUploadForm;