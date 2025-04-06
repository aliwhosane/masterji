import React from 'react';

interface DocumentTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DocumentTabs: React.FC<DocumentTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'summary', label: 'Summary', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'qa', label: 'Q&A', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'quiz', label: 'Quiz', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { id: 'notes', label: 'Notes', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
    { id: 'chat', label: 'Chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  ];

  return (
    <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200 mb-4">
      <nav className="flex space-x-4 px-2 w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-3 px-3 border-b-2 text-sm flex items-center transition duration-150 ease-in-out min-w-fit`}
            onClick={() => onTabChange(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <svg className="w-2 h-2 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default DocumentTabs;