
export type TrainingType = 'upper' | 'lower' | 'both' | 'aerobics' | 'calisthenics' | 'steps';
export type CardioPlan = 'start' | 'end' | 'no';
export type TimingOutcome = 'finished_before_time' | 'finished_on_time' | 'finished_after_time';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

export interface SessionTemplate {
  id: string;
  objective: string;
  trainingType: TrainingType;
  durationGoal: number; // minutes
  cardioPlan: CardioPlan;
  exercises: Exercise[];
  creatorId: string;
  isPublic: boolean;
  rating?: number;
}

export interface GymSession extends SessionTemplate {
  startTime: number;
  endTime?: number;
  actualDuration?: number;
  overtimeSeconds?: number;
  timingOutcome?: TimingOutcome;
  effortScore?: number; // 1-10
  journal: {
    before: string;
    during: string;
    after: string;
    reflections: string;
  };
}

export interface CommunityPost {
  id: string;
  userId: string;
  username: string;
  type: 'session_shared' | 'template_shared' | 'availability';
  content: GymSession | SessionTemplate | AvailabilityPost;
  timestamp: number;
}

export interface AvailabilityPost {
  location?: string;
  trainingType: TrainingType;
  startTime: string; // "now" or ISO string
  participants: string[];
}
