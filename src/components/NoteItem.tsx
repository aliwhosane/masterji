import { useState } from 'react';
import { Note } from '../store/slices/noteSlice';
import LoadingSpinner from './common/LoadingSpinner';

interface NoteItemProps {
  note: Note;
  onEdit: (noteId: string, content: string) => void;
  onDelete: (noteId: string) => void;
  isEditing: boolean;
}

const NoteItem = ({ note, onEdit, onDelete, isEditing }: NoteItemProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);

  const handleEditClick = () => {
    setIsEditMode(true);
    setEditedContent(note.content);
  };

  const handleSaveClick = () => {
    if (editedContent.trim()) {
      onEdit(note._id, editedContent);
      setIsEditMode(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
    setEditedContent(note.content);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isEditMode) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm transition duration-200 hover:shadow-md">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          rows={4}
          autoFocus
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancelClick}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            disabled={isEditing}
            className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded disabled:bg-blue-300 transition duration-150 flex items-center"
          >
            {isEditing ? (
              <>
                <LoadingSpinner size="small" color="white" />
                <span className="ml-1">Saving...</span>
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition duration-200">
      <div className="whitespace-pre-line mb-3 text-gray-800 leading-relaxed">{note.content}</div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-500 pt-2 border-t border-gray-100">
        <span className="mb-2 sm:mb-0">Last updated: {formatDate(note.updatedAt)}</span>
        <div className="space-x-2">
          <button
            onClick={handleEditClick}
            className="text-blue-600 hover:text-blue-800 transition duration-150 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => onDelete(note._id)}
            className="text-red-600 hover:text-red-800 transition duration-150 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;