import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { SavedResponse, CreateSavedResponseRequest } from './types';

const client = generateClient<Schema>();

export class SavedResponsesService {
  static async getSavedResponses(): Promise<SavedResponse[]> {
    try {
      const { data } = await client.models.SavedResponse.list();
      return data.map(item => ({
        id: item.id,
        question: item.question || '',
        answer: item.answer || '',
        fileName: item.fileName || '',
        savedAt: item.savedAt || new Date().toISOString(),
        tags: (item.tags || []).filter((tag): tag is string => tag !== null),
      }));
    } catch (error) {
      console.error('Error fetching saved responses:', error);
      throw new Error('Failed to fetch saved responses');
    }
  }

  static async getSavedResponse(id: string): Promise<SavedResponse | null> {
    try {
      const { data } = await client.models.SavedResponse.get({ id });
      if (!data) return null;

      return {
        id: data.id,
        question: data.question || '',
        answer: data.answer || '',
        fileName: data.fileName || '',
        savedAt: data.savedAt || new Date().toISOString(),
        tags: (data.tags || []).filter((tag): tag is string => tag !== null),
      };
    } catch (error) {
      console.error('Error fetching saved response:', error);
      throw new Error('Failed to fetch saved response');
    }
  }

  static async createSavedResponse(
    request: CreateSavedResponseRequest
  ): Promise<SavedResponse> {
    try {
      const { data } = await client.models.SavedResponse.create({
        question: request.question,
        answer: request.answer,
        fileName: request.fileName,
        savedAt: new Date().toISOString(),
        tags: request.tags || [],
      });

      if (!data) {
        throw new Error('Failed to create saved response');
      }

      return {
        id: data.id,
        question: data.question || '',
        answer: data.answer || '',
        fileName: data.fileName || '',
        savedAt: data.savedAt || new Date().toISOString(),
        tags: (data.tags || []).filter((tag): tag is string => tag !== null),
      };
    } catch (error) {
      console.error('Error creating saved response:', error);
      throw new Error('Failed to save response');
    }
  }

  static async deleteSavedResponse(id: string): Promise<void> {
    try {
      await client.models.SavedResponse.delete({ id });
    } catch (error) {
      console.error('Error deleting saved response:', error);
      throw new Error('Failed to delete saved response');
    }
  }

  static async updateSavedResponse(
    id: string,
    updates: Partial<CreateSavedResponseRequest>
  ): Promise<SavedResponse> {
    try {
      const { data } = await client.models.SavedResponse.update({
        id,
        ...updates,
      });

      if (!data) {
        throw new Error('Failed to update saved response');
      }

      return {
        id: data.id,
        question: data.question || '',
        answer: data.answer || '',
        fileName: data.fileName || '',
        savedAt: data.savedAt || new Date().toISOString(),
        tags: (data.tags || []).filter((tag): tag is string => tag !== null),
      };
    } catch (error) {
      console.error('Error updating saved response:', error);
      throw new Error('Failed to update saved response');
    }
  }
}