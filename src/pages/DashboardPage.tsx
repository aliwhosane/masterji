import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserDocuments, deleteDocument } from '../store/slices/documentSlice';
import DocumentUploadForm from '../components/DocumentUploadForm';

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { documents, status, error } = useAppSelector((state) => state.documents);
  const { userInfo } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUserDocuments());
    }
  }, [dispatch, status]);

  const handleDeleteDocument = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await dispatch(deleteDocument(id)).unwrap();
      } catch (error) {
        console.error('Failed to delete document:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 w-full">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column - Document list */}
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">Your Documents</h1>
            
            {status === 'loading' && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {status === 'failed' && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{error}</p>
              </div>
            )}
            
            {status === 'succeeded' && documents.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">You don't have any documents yet.</p>
                <p className="text-gray-500 mt-2">Upload your first document to get started!</p>
              </div>
            )}
            
            {status === 'succeeded' && documents.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uploaded
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((doc) => (
                      <tr key={doc._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link to={`/documents/${doc._id}`} className="text-blue-600 hover:text-blue-800">
                            {doc.originalFilename}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(doc.uploadedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            doc.status === 'ready' 
                              ? 'bg-green-100 text-green-800' 
                              : doc.status === 'processing' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteDocument(doc._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        {/* Right column - Upload form */}
        <div className="w-full md:w-1/3">
          <DocumentUploadForm />
          
          {/* User welcome section */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold mb-2">Welcome, {userInfo?.name}!</h2>
            <p className="text-gray-600">
              Upload documents to analyze them with AI and create study materials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;