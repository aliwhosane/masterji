import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchDocumentById, 
  deleteDocument, 
  generateDocumentSummary,
  generateDocumentQa, 
  generateDocumentQuiz 
} from '../store/slices/documentSlice';
import { toast } from 'react-hot-toast';
import Skeleton from '../components/common/Skeleton';

// Import components
import DocumentHeader from '../components/document/DocumentHeader';
import DocumentTabs from '../components/document/DocumentTabs';
import SummaryTab from '../components/document/SummaryTab';
import QaTab from '../components/document/QaTab';
import QuizTab from '../components/document/QuizTab';
import NotesTab from '../components/document/NotesTab';
import ChatTab from '../components/document/ChatTab';

const DocumentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');
  const [isSummaryGenerating, setIsSummaryGenerating] = useState(false);
  const [isQaGenerating, setIsQaGenerating] = useState(false);
  const [isQuizGenerating, setIsQuizGenerating] = useState(false);
  
  const { currentDocument, currentDocumentStatus, currentDocumentError } = 
    useAppSelector((state) => state.documents);

  useEffect(() => {
    if (id) {
      dispatch(fetchDocumentById(id));
    }
    
    // Cleanup function to reset current document when unmounting
    return () => {
      // You can dispatch clearCurrentDocument here if needed
    };
  }, [dispatch, id]);

  const handleDeleteDocument = async () => {
    if (!currentDocument) return;
    
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await dispatch(deleteDocument(currentDocument._id)).unwrap();
        toast.success('Document deleted successfully');
        navigate('/');
      } catch (error) {
        console.error('Failed to delete document:', error);
        toast.error('Failed to delete document');
      }
    }
  };

  const handleGenerateSummary = async () => {
    if (!id) return;
    
    setIsSummaryGenerating(true);
    try {
      await dispatch(generateDocumentSummary(id)).unwrap();
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setIsSummaryGenerating(false);
    }
  };

  const handleGenerateQa = async () => {
    if (!id) return;
    
    setIsQaGenerating(true);
    try {
      await dispatch(generateDocumentQa(id)).unwrap();
    } catch (error) {
      console.error('Failed to generate Q&A:', error);
      
    } finally {
      setIsQaGenerating(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!id) return;
    
    setIsQuizGenerating(true);
    try {
      await dispatch(generateDocumentQuiz(id)).unwrap();
    } catch (error) {
      console.error('Failed to generate quiz:', error);
    } finally {
      setIsQuizGenerating(false);
    }
  };

  if (currentDocumentStatus === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <Skeleton height="h-8" className="w-3/4" />
            <Skeleton height="h-4" className="w-1/2" />
            <div className="mt-6 border-b border-gray-200">
              <div className="flex space-x-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} width="w-20" height="h-10" />
                ))}
              </div>
            </div>
            <div className="py-8">
              <Skeleton count={3} className="mb-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Improve error state
  if (currentDocumentStatus === 'failed') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-red-700 mb-2">Failed to load document</h2>
          <p className="text-red-600 mb-4">{currentDocumentError || 'An error occurred'}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!currentDocument) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Document not found</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        {/* Document header */}
        <DocumentHeader 
          filename={currentDocument.originalFilename}
          uploadedAt={currentDocument.uploadedAt}
          status={currentDocument.status}
          onDelete={handleDeleteDocument}
        />
        {/* Tabs - make them scroll horizontally on small screens */}
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
          <DocumentTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Tab content */}
        <div className="py-4">
          {activeTab === 'summary' && (
            <SummaryTab 
              summary={currentDocument.summary || null}
              isGenerating={isSummaryGenerating}
              onGenerate={handleGenerateSummary}
              documentStatus={currentDocumentStatus}
            />
          )}

          {activeTab === 'qa' && (
            <QaTab 
              questions={currentDocument.generatedQuestions || null}
              isGenerating={isQaGenerating}
              onGenerate={handleGenerateQa}
              documentStatus={currentDocumentStatus}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizTab 
              quiz={currentDocument.generatedQuiz || null}
              documentId={currentDocument._id}
              isGenerating={isQuizGenerating}
              onGenerate={handleGenerateQuiz}
              documentStatus={currentDocumentStatus}
            />
          )}

          {activeTab === 'notes' && (
            <NotesTab documentId={currentDocument._id} />
          )}

          {activeTab === 'chat' && (
            <ChatTab documentId={currentDocument._id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailPage;