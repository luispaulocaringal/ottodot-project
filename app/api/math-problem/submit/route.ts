import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

import { supabase } from '../../../../lib/supabaseClient';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

const math_problem_submissions_table = 'math_problem_submissions';

export async function POST (req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const body = await req.json();
  
  let feedbackResponse:any;

  try {
    // Call Google Gemini API
    feedbackResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Check if the answer is correct and generate a feedback on this question and answer. ${body.problem} ${body.userAnswer}`,
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: 
        {
          type: Type.OBJECT,
          properties: {
            feedback: {
              type: Type.STRING,
            },
            correct_answer: {
              type: Type.NUMBER,
            },
            is_correct: {
              type: Type.BOOLEAN,
            },
          },
        }
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: 0,
      message: "Error generating math problem. Please try again."
    });
  }

  const problem = JSON.parse(feedbackResponse.text);

  try {
    // Insert to Supabase
    const response = await supabase
      .from(math_problem_submissions_table)
      .insert({ 
        session_id: id,
        user_answer: body.userAnswer,
        is_correct: problem.is_correct,
        feedback_text: problem.feedback
      })
      .select()
      .single();

    if (response.error) {
      return NextResponse.json({
        success: 0,
        message: "Error submitting answer. Please try again later."
      });
    }

    return NextResponse.json({
      success: 1,
      message: response.data
    });
  } catch (error) {
    return NextResponse.json({
      success: 0,
      message: "Error with the database. Please contact the developer immediately."
    });
  }
}