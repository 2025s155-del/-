/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EventCategory = 'korean-official' | 'civil-defense' | 'japanese-source' | 'international-decree' | 'imperialist-aggression';

export interface HistoryEvent {
  id: string;
  year: number;
  eraName: string; // e.g. "지증왕 13년", "숙종 19년"
  title: string;
  category: EventCategory;
  source: string; // Document source, e.g. "삼국사기", "세종실록지리지"
  summary: string;
  description: string;
  highlights?: string[]; // Core quotes or key points
  pageNumber: number; // Page in the PDF source (1, 2, 3, 4)
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
