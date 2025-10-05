import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

import { supabase } from '../../../lib/supabaseClient'

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

const math_problem_session_table = 'math_problem_sessions';

export async function GET (req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    let problemResponse:any;

    try {
      // Call Google Gemini API
      problemResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Generate a math problem suitable for a Primary 5 Student.",
        config: {
          temperature: 0.7,
          responseMimeType: "application/json",
          responseSchema: 
          {
            type: Type.OBJECT,
            properties: {
              problem_text: {
                type: Type.STRING,
              },
              correct_answer: {
                type: Type.NUMBER,
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

    // Parse JSON object
    const problem = JSON.parse(problemResponse.text);

    // Save session
    try {
      const sessionResponse = await supabase
        .from(math_problem_session_table)
        .insert({ 
          problem_text: problem.problem_text, 
          correct_answer: problem.correct_answer
        })
        .select()
        .single();

      if (sessionResponse.error) {
        return NextResponse.json({
          success: 0,
          message: "Error saving math problem session. Please try again."
        });
      }

      return NextResponse.json({
        success: 1,
        message: sessionResponse.data
      });
    } catch (error) {
      return NextResponse.json({
        success: 0,
        message: "Error with the database. Please contact the developer immediately."
      });
    }
  } else {
    try {
      // Get existing session
      const response = await supabase
        .from(math_problem_session_table)
        .select()
        .eq('id', id)
        .single();
  
      if (response.error) {
        return NextResponse.json({
          success: 0,
          message: "Error getting math problem session. Please try again."
        });
      }

      return NextResponse.json({
        success: 1,
        message: response.data
      });
    } catch (error) {
      return NextResponse.json({
        success: 0,
        message: "Database is offline. Please contact the developer immediately."
      });
    }
  }
}