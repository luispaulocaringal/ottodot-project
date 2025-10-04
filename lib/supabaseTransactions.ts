import { supabase } from './supabaseClient'

const math_problem_session_table = 'math_problem_sessions';
const math_problem_submissions_table = 'math_problem_submissions';

export const createMathProblemSession = async (
  {
    problem_text, final_answer
  } : {
    problem_text: string, final_answer:number
  },
) => {
  try {
    // Insert to Supabase
    const response = await supabase
      .from(math_problem_session_table)
      .insert({ 
        problem_text: problem_text, 
        correct_answer: final_answer 
      })
      .select()
      .single();

    localStorage.setItem('sessionId', response.data.id);

    if (response.error) {
      return false;
    }

    return response.data;
  } catch (error) {
    return false;
  }
}

export const updateMathProblemSession = async (
  sessionId: string,
  {
    problem_text, final_answer
  } : {
    problem_text: string, final_answer:number
  },
) => {
  try {
    // Update to Supabase
    const response = await supabase
      .from(math_problem_session_table)
      .update({ 
        problem_text: problem_text, 
        correct_answer: final_answer 
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (response.error) {
      return false;
    }

    return response.data;
  } catch (error) {
    return false;
  }
}

export const getMathProblemSession = async (sessionId: string) => {
  try {
    // Get existing session
    const response = await supabase
      .from(math_problem_session_table)
      .select()
      .eq('id', sessionId)
      .single();

    if (response.error) {
      return false;
    }

    return response.data;
  } catch (error) {
    return false;
  }
}

export const createMathProblemSubmission = async (
  {
    sessionId,
    userAnswer,
    isCorrect,
    feedback
  } : {
    sessionId: string,
    userAnswer: number,
    isCorrect: boolean,
    feedback: string
  }
) => {
  try {
    // Insert to Supabase
    const response = await supabase
      .from(math_problem_submissions_table)
      .insert({ 
        session_id: sessionId,
        user_answer: userAnswer,
        is_correct: isCorrect,
        feedback_text: feedback
      })
      .select()
      .single();

    if (response.error) {
      return false;
    }

    return response.data;
  } catch (error) {
    return false;
  }
}