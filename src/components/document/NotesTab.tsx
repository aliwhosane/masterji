import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchDocumentNotes,
  addNote,
  editNote,
  removeNote
} from '../../store/slices/noteSlice';
import NoteItem from '../NoteItem';
import LoadingSpinner from '../common/LoadingSpinner';
import Skeleton from '../common/Skeleton';
import { toast } from 'react-hot-toast';

interface NotesTabProps {
  documentId: string;
}

const NotesTab: React.FC<NotesTabProps> = ({ documentId }) => {
  const dispatch = useAppDispatch();
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  
  const { 
    notes, 
    status: notesStatus, 
    error: notesError,
    addStatus,
    // Remove unused variables
    // const editStatus = ...;
    // const deleteStatus = ...;
  } = useAppSelector((state) => state.notes);

  useEffect(() => {
    if (documentId && notesStatus === 'idle') {
      dispatch(fetchDocumentNotes(documentId));
    }
  }, [documentId, notesStatus, dispatch]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentId || !newNoteContent.trim()) return;
    
    setIsAddingNote(true);
    try {
      await dispatch(addNote({ documentId, content: newNoteContent })).unwrap();
      setNewNoteContent('');
      toast.success('Note added successfully');
    } catch (error) {
      console.error('Failed to add note:', error);
      toast.error('Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleEditNote = async (noteId: string, content: string) => {
    setEditingNoteId(noteId);
    try {
      await dispatch(editNote({ noteId, content })).unwrap();
      toast.success('Note updated successfully');
    } catch (error) {
      console.error('Failed to edit note:', error);
      toast.error('Failed to update note');
    } finally {
      setEditingNoteId(null);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await dispatch(removeNote(noteId)).unwrap();
        toast.success('Note deleted successfully');
      } catch (error) {
        console.error('Failed to delete note:', error);
        toast.error('Failed to delete note');
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Notes</h2>
      
      {/* Add new note form */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <form onSubmit={handleAddNote}>
          <div className="mb-3">
            <label htmlFor="newNote" className="block text-sm font-medium text-gray-700 mb-1">
              Add a new note
            </label>
            <textarea
              id="newNote"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              rows={4}
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Write your note here..."
              required
            />
          </div>
          {addStatus === 'failed' && (
            <div className="mb-3 text-red-500 text-sm bg-red-50 p-2 rounded">
              Failed to add note. Please try again.
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isAddingNote || !newNoteContent.trim()}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-200 flex items-center"
            >
              {isAddingNote ? (
                <>
                  <LoadingSpinner size="small" color="white" />
                  <span className="ml-2">Adding...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Note
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Notes list */}
      {notesStatus === 'loading' && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <Skeleton count={3} className="mb-2" />
              <div className="flex justify-between mt-4">
                <Skeleton width="w-1/4" />
                <Skeleton width="w-1/6" />
              </div>
            </div>
          ))}
        </div>
      )}
      
      {notesStatus === 'failed' && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <div className="flex">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{notesError || 'Failed to load notes'}</p>
          </div>
          <button 
            onClick={() => dispatch(fetchDocumentNotes(documentId))}
            className="mt-2 text-sm underline flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try again
          </button>
        </div>
      )}
      
      {notesStatus === 'succeeded' && notes.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500">No notes yet. Add your first note above!</p>
        </div>
      )}
      
      {notesStatus === 'succeeded' && notes.length > 0 && (
        <div className="space-y-4">
          {notes.map((note) => (
            <NoteItem
              key={note._id}
              note={note}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
              isEditing={editingNoteId === note._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesTab;