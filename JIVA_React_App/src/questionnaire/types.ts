// Shared questionnaire model. Question ids map 1:1 to the engine input's
// `questionnaire` block (Data/Engine/jiva_engine_prompt_v5.md) so answers can
// be stored in Questionnaire.data and fed to the engine unchanged.

export type QuestionPhase = 'pre' | 'anytime';
// 'pre'     — asked in the intake wizard before package selection / payment.
// 'anytime' — (red in the source doc) answerable whenever the user is logged in.

export type AnswerValue =
  | string
  | number
  | string[]
  | RepeatRow[]
  | Record<string, string> // nested blocks, e.g. the constitution quiz
  | null;
export type Answers = Record<string, AnswerValue>;

export interface RepeatRow {
  [columnId: string]: string;
}

export interface ShowIf {
  questionId: string;
  equals: string;
}

interface QuestionBase {
  id: string;
  label: string;
  phase: QuestionPhase;
  helper?: string;
  /** Render only when another answer matches (conditional reveal). */
  showIf?: ShowIf;
  /** Indent under the previous question (sub-question styling). */
  sub?: boolean;
}

export interface SingleQuestion extends QuestionBase {
  kind: 'single';
  options: string[];
  /** Adds an "Other" pill with a free-text field stored at `${id}_other`. */
  allowOther?: boolean;
}

export interface MultiQuestion extends QuestionBase {
  kind: 'multi';
  options: string[];
  allowOther?: boolean;
  /** Longer descriptions per option (multi-select cards). */
  optionDescriptions?: Record<string, string>;
}

export interface YesNoQuestion extends QuestionBase {
  kind: 'yesno';
}

export interface TextQuestion extends QuestionBase {
  kind: 'text';
  multiline?: boolean;
  placeholder?: string;
}

export interface SliderQuestion extends QuestionBase {
  kind: 'slider';
  min: number;
  max: number;
  defaultValue: number;
  minLabel: string;
  midLabel?: string;
  maxLabel: string;
}

export interface TagsQuestion extends QuestionBase {
  kind: 'tags';
  options: string[];
  placeholder?: string;
}

export interface RowsColumn {
  id: string;
  label: string;
  type: 'select' | 'text';
  options?: string[];
  placeholder?: string;
}

export interface RowsQuestion extends QuestionBase {
  kind: 'rows';
  columns: RowsColumn[];
  addLabel: string;
}

export type Question =
  | SingleQuestion
  | MultiQuestion
  | YesNoQuestion
  | TextQuestion
  | SliderQuestion
  | TagsQuestion
  | RowsQuestion;

export interface QuestionnaireSection {
  id: string;
  title: string;
  subtitle: string;
  note?: string;
  questions: Question[];
}
