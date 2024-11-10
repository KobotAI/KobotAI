import * as natural from 'natural';
import * as stopword from 'stopword';
import { WordTokenizer, TfIdf, PorterStemmer } from 'natural';

export class AdvancedTextPreprocessor {
  private tokenizer: WordTokenizer;
  private tfidf: TfIdf;
  private stemmer: typeof PorterStemmer;
  private cache: Map<string, string>;  // Simple cache using a Map

  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.tfidf = new natural.TfIdf();
    this.stemmer = natural.PorterStemmer;
    this.cache = new Map();  // Initialize cache
  }

  // Manual caching mechanism
  public preprocessInput(input: string): string {
   
    // Check if the input has been processed before
    if (this.cache.has(input)) {
      return this.cache.get(input)!;  // Return cached result
    }

    // Process the input if not cached
    const processedInput = this.pipeline(input);

    // Check if the input is short; 50 characters
    if (input.length <= 50) {
      return processedInput;
    }
    const finalResult = processedInput.length > 500 ? this.summarizeText(processedInput) : processedInput;

    // Store the result in the cache
    this.cache.set(input, finalResult);

    return finalResult;
  }

  private pipeline(input: string): string {
    return this.stem(
      this.removePunctuation(
        this.removeStopwords(
          this.tokenize(
            this.normalize(input)
          )
        )
      )
    );
  }

  private normalize(input: string): string {
    return input.toLowerCase().trim();
  }

  private tokenize(input: string): string[] {
    return this.tokenizer.tokenize(input) || [];
  }

  private removeStopwords(tokens: string[]): string[] {
    return stopword.removeStopwords(tokens);
  }

  private removePunctuation(tokens: string[]): string[] {
    return tokens.map(token => token.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ")).filter(Boolean);
  }

  private stem(tokens: string[]): string {
    return tokens.map(token => this.stemmer.stem(token)).join(' ');
  }

  private summarizeText(text: string): string {
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    this.tfidf.addDocument(text);

    const scoredSentences = sentences.map((sentence, index) => ({
      sentence,
      score: this.getSentenceImportance(sentence, index)
    }));

    scoredSentences.sort((a, b) => b.score - a.score);
    const topSentences = scoredSentences.slice(0, 3).map(item => item.sentence);

    return topSentences.join('. ') + '.';
  }

  private getSentenceImportance(sentence: string, index: number): number {
    const words = this.tokenize(sentence);
    const uniqueWords = new Set(words);
    let score = 0;

    uniqueWords.forEach(word => {
      const tfidfScore = this.tfidf.tfidf(word, 0);
      score += tfidfScore;
    });

    // Boost the importance of early sentences
    score *= (1 - index / 10);

    return score;
  }
}
