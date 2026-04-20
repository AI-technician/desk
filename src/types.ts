export type Urgency = '상' | '중' | '하';
export type Category = '현장/민원' | '제도/지침' | '전산/시스템' | '조직/인력';

export interface ProblemData {
  id: number;
  title: string;
  category: Category;
  urgency: Urgency;
  impact: Urgency;
  cause: string;
  officerRisk: string;
  shortTerm: string;
  longTerm: string;
  example: string;
}

export interface ChecklistItem {
  id: number;
  text: string;
}

export interface SimulatorScript {
  id: string;
  label: string;
  script: string;
}
