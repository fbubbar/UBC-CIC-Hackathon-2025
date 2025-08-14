"use client";

import { useState } from "react";
import { SavedResponse } from "@/lib/api";
import Link from "next/link";

export default function Dashboard() {
  const [selectedResponse, setSelectedResponse] =
    useState<SavedResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSelectResponse = (response: SavedResponse) => {
    setSelectedResponse(response);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResponse(null);
  };

  const handleResponseSaved = () => {
    // Trigger a refresh of the SavedResponses component
    setRefreshTrigger((prev) => prev + 1);
  };

  return <div className="min-h-screen bg-gray-100">this is the dashboard</div>;
}
