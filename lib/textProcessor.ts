export interface DocumentChunk {
  content: string;
  index: number;
}

export interface SearchResult {
  content: string;
  score: number;
  index: number;
}

export class TextProcessor {
  /**
   * Split text into overlapping chunks
   */
  static chunkText(text: string, chunkSize: number = 500, overlap: number = 50): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    const words = text.split(/\s+/);
    
    let start = 0;
    let index = 0;
    
    while (start < words.length) {
      const end = Math.min(start + chunkSize, words.length);
      const chunk = words.slice(start, end).join(' ');
      
      chunks.push({
        content: chunk,
        index: index++
      });
      
      start += chunkSize - overlap;
    }
    
    return chunks;
  }

  /**
   * Simple text similarity using word overlap
   */
  static calculateSimilarity(query: string, text: string): number {
    const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    const textWords = text.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    
    const querySet = new Set(queryWords);
    const textSet = new Set(textWords);
    
    const intersection = queryWords.filter(word => textSet.has(word));
    const unionSize = new Set(queryWords.concat(textWords)).size;
    
    return intersection.length / unionSize;
  }

  /**
   * Search for relevant chunks based on query
   */
  static searchChunks(query: string, chunks: DocumentChunk[], topK: number = 3): SearchResult[] {
    const results = chunks
      .map(chunk => ({
        content: chunk.content,
        score: this.calculateSimilarity(query, chunk.content),
        index: chunk.index
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return results;
  }

  /**
   * Clean and normalize text
   */
  static cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // normalize whitespace
      .replace(/[^\w\s.,!?;:-]/g, '') // remove special characters
      .trim();
  }
}
