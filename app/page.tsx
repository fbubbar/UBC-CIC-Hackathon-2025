"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react";
import PDFQuestionForm from "@/components/PDFQuestionForm";
import SavedResponses from "@/components/SavedResponses";
import ResponseModal from "@/components/ResponseModal";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const { user, signOut } = useAuthenticator();
  const [selectedResponse, setSelectedResponse] = useState<Schema["SavedResponse"]["type"] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSelectResponse = (response: Schema["SavedResponse"]["type"]) => {
    setSelectedResponse(response);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResponse(null);
  };

  const handleResponseSaved = () => {
    // Trigger a refresh of the SavedResponses component
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Welcome, {user?.signInDetails?.loginId}
              </h1>
              <p className="text-sm text-gray-600">
                AI-Powered Document Analysis
              </p>
            </div>
            <button 
              onClick={signOut}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <PDFQuestionForm onResponseSaved={handleResponseSaved} />
          </div>
          <div>
            <SavedResponses 
              onSelectResponse={handleSelectResponse} 
              refreshTrigger={refreshTrigger}
            />
          </div>
        </div>
      </main>

      {/* Response Modal */}
      <ResponseModal 
        response={selectedResponse}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
