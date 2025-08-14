'use client';

import { useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

interface RelevantChunk {
  content: string;
  score: number;
}

interface QAResponse {
  answer: string;
  relevantChunks: RelevantChunk[];
  success: boolean;
}

interface PDFQuestionFormProps {
  onResponseSaved?: () => void;
}

export default function PDFQuestionForm({ onResponseSaved }: PDFQuestionFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<QAResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid PDF file');
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !question.trim()) {
      setError('Please select a PDF file and enter a question');
      return;
    }

    if (question.length > 500) {
      setError('Question must be 500 characters or less');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('question', question);

      const res = await fetch('/api/pdf-qa', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setResponse(data);
      } else {
        setError(data.error || 'Failed to process request');
      }
    } catch (err) {
      setError('Network error occurred. Please try again.');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setQuestion('');
    setResponse(null);
    setError(null);
    setSaveSuccess(false);
  };

  const saveResponse = async () => {
    if (!response || !question) return;

    setSaving(true);
    try {
      await client.models.SavedResponse.create({
        question: question,
        answer: response.answer,
        fileName: file?.name || '',
        savedAt: new Date().toISOString(),
        tags: [] // Could be enhanced to allow user to add tags
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3 seconds
      
      // Notify parent component that a response was saved
      if (onResponseSaved) {
        onResponseSaved();
      }
    } catch (error) {
      console.error('Error saving response:', error);
      setError('Failed to save response. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold">PDF Question Answering</h1>
          <p className="text-blue-100 mt-2">
            Upload a PDF document and ask questions about its content
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Upload */}
          <div>
            <label htmlFor="pdf-file" className="block text-sm font-medium text-gray-700 mb-2">
              Select PDF Document
            </label>
            <input
              id="pdf-file"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={loading}
            />
            {file && (
              <p className="text-sm text-green-600 mt-1">
                ✓ {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Question Input */}
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
              Your Question ({question.length}/500 characters)
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to know about this document?"
              maxLength={500}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading || !file || !question.trim()}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Ask Question'
              )}
            </button>
            
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </form>

        {/* Response Section */}
        {response && (
          <div className="border-t bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Answer</h2>
              <div className="flex items-center space-x-3">
                {saveSuccess && (
                  <span className="text-green-600 text-sm font-medium">
                    ✓ Response saved!
                  </span>
                )}
                <button
                  onClick={saveResponse}
                  disabled={saving}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {saving ? 'Saving...' : 'Save Response'}
                </button>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md border">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {response.answer}
              </p>
            </div>

            {response.relevantChunks && response.relevantChunks.length > 0 && (
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 mb-3">
                  Relevant sections from document:
                </h3>
                <div className="space-y-3">
                  {response.relevantChunks.map((chunk, index) => (
                    <div key={index} className="bg-white p-3 rounded border-l-4 border-blue-200">
                      <p className="text-sm text-gray-600">
                        {chunk.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Relevance: {(chunk.score * 100).toFixed(1)}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
