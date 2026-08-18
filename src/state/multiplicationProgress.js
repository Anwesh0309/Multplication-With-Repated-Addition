// ──────────────────────────────────────────────────────────────────────────────
// Session / Progress State — Multiplication as Repeated Addition
// Lightweight React Context + reducer; no external state library.
// ──────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useReducer } from 'react';

const INITIAL_STATE = {
  phase: 'intro',          // 'intro' | 'wonder' | 'story' | 'stations' | 'reflect' | 'practice' | 'summary'
  learnPhaseCompleted: false,
  xp: 0,
  streak: 0,
  maxStreak: 0,
  starsEarned: 0,
  questionsAnswered: 0,
  questionsCorrect: 0,
  difficultyBias: 0,        // adaptive: increases on correct streaks, decreases on misses
  worldResults: {},
  currentSessionQuestions: [],
  currentQuestionIndex: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.phase };

    case 'COMPLETE_LEARN':
      return { ...state, learnPhaseCompleted: true };

    case 'CORRECT_ANSWER': {
      const newStreak = state.streak + 1;
      const baseXP    = 10;
      const bonusXP   = newStreak >= 5 ? 5 : 0;
      const earned    = baseXP + bonusXP;
      const newBias   = Math.min(20, state.difficultyBias + (newStreak >= 3 ? 1 : 0));
      return {
        ...state,
        streak: newStreak,
        maxStreak: Math.max(state.maxStreak, newStreak),
        xp: state.xp + earned,
        starsEarned: state.starsEarned + (newStreak % 10 === 0 ? 1 : 0),
        questionsAnswered: state.questionsAnswered + 1,
        questionsCorrect:  state.questionsCorrect  + 1,
        difficultyBias:    newBias,
        lastXPEarned:      earned,
      };
    }

    case 'WRONG_ANSWER': {
      const newBias = Math.max(-10, state.difficultyBias - 2);
      return {
        ...state,
        streak: 0,
        questionsAnswered: state.questionsAnswered + 1,
        difficultyBias:    newBias,
        lastXPEarned:      0,
      };
    }

    case 'SET_SESSION_QUESTIONS':
      return {
        ...state,
        currentSessionQuestions: action.questions,
        currentQuestionIndex: 0,
      };

    case 'NEXT_QUESTION':
      return { ...state, currentQuestionIndex: state.currentQuestionIndex + 1 };

    case 'SET_WORLD_RESULT':
      return {
        ...state,
        worldResults: {
          ...state.worldResults,
          [action.worldId]: action.result,
        },
      };

    case 'RESET':
      return { ...INITIAL_STATE };

    default:
      return state;
  }
}

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  return (
    <ProgressContext.Provider value={{ state, dispatch }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
