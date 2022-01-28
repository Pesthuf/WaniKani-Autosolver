type ObjectType = "summary" | 'Review' | 'Assignment';

export interface ResponseCommon<T> {
  object: string;
  url: string;
  data_updated_at: Date;
  data: T | T[];
}

export interface CollectionResponse<T> extends ResponseCommon<T> {
  object: "collection";
  url: string;
  pages: Pages;
  total_count: number;
  data_updated_at: Date;
  data: T[];
}

export interface SingleResponse<T> extends ResponseCommon<T> {
  object: ObjectType;
  data: T;
}

export interface Review {
  id: number;
  object: string;
  url: string;
  data_updated_at: Date;
  data: ReviewData;
}

export interface ReviewData {
  created_at: Date;
  assignment_id: number;
  spaced_repetition_system_id: number;
  subject_id: number;
  starting_srs_stage: number;
  ending_srs_stage: number;
  incorrect_meaning_answers: number;
  incorrect_reading_answers: number;
}

export interface Assignment {
  id: number;
  object: 'assignment';
  url: string;
  data_updated_at: Date;
  data: AssignmentData;
}

export interface AssignmentData {
  created_at: Date;
  subject_id: number;
  subject_type: string;
  srs_stage: number;
  unlocked_at: Date;
  started_at: Date;
  passed_at: Date;
  burned_at: null;
  available_at: Date;
  resurrected_at: null;
}

export interface Pages {
  per_page: number;
  next_url: string;
  previous_url: null;
}


export interface Summary {
  lessons: Lesson[];
  next_reviews_at: Date;
  reviews: Lesson[];
}

export interface Lesson {
  available_at: Date;
  subject_ids: number[];
}

/// Subject-Related

type SubjectDataType ='kanji' | 'vocabulary' | 'radical';

export interface Subject {
  id:              number;
  object:          SubjectDataType;
  url:             string;
  data_updated_at: Date;
  data:            SubjectData;
}

export interface SubjectData {
  created_at:                   Date;
  level:                        number;
  slug:                         string;
  hidden_at:                    null;
  document_url:                 string;
  characters:                   string;
  meanings:                     Meaning[];
  readings:                     Reading[];
  component_subject_ids:        number[];
  amalgamation_subject_ids:     number[];
  visually_similar_subject_ids: any[];
  meaning_mnemonic:             string;
  meaning_hint:                 string;
  reading_mnemonic:             string;
  reading_hint:                 string;
  lesson_position:              number;
  spaced_repetition_system_id:  number;
}

export interface Meaning {
  meaning:         string;
  primary:         boolean;
  accepted_answer: boolean;
}

export interface Reading {
  type:            string;
  primary:         boolean;
  accepted_answer: boolean;
  reading:         string;
}

export const enum Levels {
  UNLOCKING,
  APP_1,
  APP_2,
  APP_3,
  APP_4,
  GURU,
  GURU_2,
  MASTER,
  ENLIGHTENED,
  BURNED
}


export type WaniKaniResponse<T> = CollectionResponse<T> | SingleResponse<T>;
