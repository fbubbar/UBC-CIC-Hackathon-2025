'use client';

import { SavedResponse } from '@/lib/api';

interface ResponseModalProps {
  response: SavedResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ResponseModal({ response, isOpen, onClose }: ResponseModalProps) {
  if (!isOpen || !response) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden">
        <div className="bg-blue-600 text-white p-6 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">Saved Response</h2>
            {response.fileName && (
              <p className="text-blue-100 text-sm">📄 {response.fileName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl leading-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Question */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Question</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800">{response.question}</p>
              </div>
            </div>

            {/* Answer */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Answer</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {response.answer}
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className="border-t pt-4">
              <div className="flex flex-wrap items-center justify-between text-sm text-gray-500">
                <div>
                  <span className="font-medium">Saved on:</span>{' '}
                  {new Date(response.savedAt).toLocaleDateString()} at{' '}
                  {new Date(response.savedAt).toLocaleTimeString()}
                </div>
                
                {response.tags && response.tags.length > 0 && (
                  <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                    <span className="font-medium">Tags:</span>
                    <div className="flex space-x-1">
                      {response.tags.map((tag, index) => (
                        tag && (
                          <span
                            key={index}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {tag}
                          </span>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
