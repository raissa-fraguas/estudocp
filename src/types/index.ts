export type DayOfWeek = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom';

export type GoalStatus = 'pendente' | 'concluida' | 'em_andamento';

export type DifficultyLevel = 'Muito Fácil' | 'Fácil' | 'Médio' | 'Difícil' | 'Muito Difícil';

export type MistakeReason = 
  | 'Falta de atenção / Pegadinha'
  | 'Lacuna teórica / Conteúdo não visto'
  | 'Esquecimento de regra / Prazo'
  | 'Dúvida entre duas alternativas'
  | 'Interpretação do enunciado'
  | 'Jurisprudência / Lei Seca recente';

export interface SubjectTopic {
  id: string;
  title: string;
  completed: boolean;
  notes?: string;
  revisedR24?: boolean;
  revisedR7?: boolean;
  revisedR30?: boolean;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  color: string;
  weeklyTargetHours: number;
  weight: number;
  topics: SubjectTopic[];
}

export interface StudyGoal {
  id: string;
  subjectId: string;
  topicTitle: string;
  targetDurationMinutes: number; // e.g. 60 = 01:00:00, 30 = 00:30:00
  dayOfWeek: DayOfWeek;
  date: string; // YYYY-MM-DD
  status: GoalStatus;
  actualMinutes?: number;
  questionsCorrect?: number;
  questionsWrong?: number;
  difficulty?: DifficultyLevel;
  notes?: string;
  completedAt?: string;
}

export interface ErrorQuestion {
  id: string;
  subjectId: string;
  topicTitle: string;
  institution?: string; // Banca (ex: Cebraspe, FGV)
  year?: number;
  statement: string; // Enunciado
  markedOption?: string; // O que marquei
  correctOption: string; // Gabarito oficial
  mistakeReason: MistakeReason;
  explanation: string; // Por que errou / anotação de revisão
  difficulty: DifficultyLevel;
  status: 'pendente' | 'revisado' | 'dominado';
  createdAt: string;
  lastReviewedAt?: string;
  reviewCount: number;
}

export interface ExamSettings {
  studentName: string;
  examName: string;
  examDate: string; // YYYY-MM-DD
  weeklyTargetHours: number;
}
