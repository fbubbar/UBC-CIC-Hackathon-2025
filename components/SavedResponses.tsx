'use client';

import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

interface SavedResponsesProps {
  onSelectResponse?: (response: Schema['SavedResponse']['type']) => void;
  refreshTrigger?: number;
}

export default function SavedResponses({ onSelectResponse, refreshTrigger }: SavedResponsesProps) {
  const [savedResponses, setSavedResponses] = useState<Array<Schema['SavedResponse']['type']>>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  useEffect(() => {
    fetchSavedResponses();
  }, []);

  // Refresh when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      fetchSavedResponses();
    }
  }, [refreshTrigger]);

  const fetchSavedResponses = async () => {
    try {
      const { data } = await client.models.SavedResponse.list();
      // Sort by savedAt in descending order (newest first)
      const sortedData = data.sort((a, b) => 
        new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
      );
      setSavedResponses(sortedData);
    } catch (error) {
      console.error('Error fetching saved responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteResponse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saved response?')) {
      return;
    }

    try {
      await client.models.SavedResponse.delete({ id });
      setSavedResponses(prev => prev.filter(response => response.id !== id));
    } catch (error) {
      console.error('Error deleting response:', error);
    }
  };

  const filteredResponses = savedResponses.filter(response => {
    const matchesSearch = searchTerm === '' || 
      response.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (response.fileName && response.fileName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = selectedTag === '' || 
      (response.tags && response.tags.includes(selectedTag));

    return matchesSearch && matchesTag;
  });

  const getAllTags = () => {
    const tags = new Set<string>();
    savedResponses.forEach(response => {
      if (response.tags) {
        response.tags.forEach(tag => {
          if (tag) tags.add(tag);
        });
      }
    });
    return Array.from(tags).sort();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading saved responses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-green-600 text-white p-6">
        <h2 className="text-xl font-bold">Saved Responses</h2>
        <p className="text-green-100 mt-1">
          {savedResponses.length} saved Q&A pairs
        </p>
      </div>

      {savedResponses.length > 0 && (
        <div className="p-4 border-b space-y-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search responses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Tag Filter */}
          {getAllTags().length > 0 && (
            <div>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All tags</option>
                {getAllTags().map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      <div className="max-h-96 overflow-y-auto">
        {filteredResponses.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {savedResponses.length === 0 
              ? "No saved responses yet. Save your first response from the Q&A form!"
              : "No responses match your search criteria."
            }
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredResponses.map((response) => (
              <div key={response.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {response.question}
                    </h3>
                    {response.fileName && (
                      <p className="text-xs text-gray-500 mb-2">
                        📄 {response.fileName}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {response.answer.length > 200 
                        ? response.answer.substring(0, 200) + '...'
                        : response.answer
                      }
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    {onSelectResponse && (
                      <button
                        onClick={() => onSelectResponse(response)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        title="View full response"
                      >
                        View
                      </button>
                    )}
                    <button
                      onClick={() => deleteResponse(response.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      title="Delete response"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span>
                      {new Date(response.savedAt).toLocaleDateString()} at{' '}
                      {new Date(response.savedAt).toLocaleTimeString()}
                    </span>
                    {response.tags && response.tags.length > 0 && (
                      <div className="flex space-x-1">
                        {response.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
