'use client'

import React, { useState, useEffect } from 'react'
import { GoogleGenAI, Type } from "@google/genai"

import { createMathProblemSession, updateMathProblemSession, getMathProblemSession } from "../lib/supabaseTransactions"

interface MathProblem {
  problem_text: string
  final_answer: number
}

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

/**
 * Call Google Gemini API.
 *
 * @function
 * @param {string} contents - The text to be used for Text Generation. https://ai.google.dev/gemini-api/docs/text-generation
 * @param {object} responseSchema - The Structured Output object. https://ai.google.dev/gemini-api/docs/structured-output
 * @returns {object, boolean} The generated text output or error response. 
 *
 */
const callGeminiAPI = async (contents: string, responseSchema: object) => {
  try {
    // Call Google Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    // Parse JSON object
    return JSON.parse(response.text);
  } catch (error) {
    return false;
  }
}

export default function Home() {
  const [problem, setProblem] = useState<MathProblem | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  useEffect(() => {
    // Get sessionId
    const sessionId = localStorage.getItem('sessionId');
    // Get values from current session and set to State
    if (sessionId !== null && sessionId !== 'undefined') {
      const fetchData = async () => {
        const response = await getMathProblemSession(sessionId);

        console.log(response)
        // Set JSON object response to Problem state
        setProblem({
          problem_text: response.problem_text,
          final_answer: response.correct_answer
        });

        // Set Session ID to Session state
        setSessionId(response.id);

        setIsLoading(false);
      }
      fetchData();
    }

  }, [])

  const generateProblem = async () => {
    // TODO: Implement problem generation logic
    // This should call your API route to generate a new problem
    // and save it to the database

    // Set IsLoading to TRUE
    setIsLoading(true);

    // Call Gemini API request function
    const response = await callGeminiAPI(
      "Generate a math problem suitable for a Primary 5 Student.",
      {
        type: Type.OBJECT,
        properties: {
          problem_text: {
            type: Type.STRING,
          },
          final_answer: {
            type: Type.NUMBER,
          },
        },
      }
    )

    // Generate math problem error handler
    if (!response) {
      alert("Error generating math problem. Please try again.");
      setIsLoading(false);
      return 0;
    }

    // Call Session API internal function
    let session:any;
    if (sessionId) {
      session = await updateMathProblemSession(sessionId, response);
    } else {
      session = await createMathProblemSession(response);
    }

    // Create session error
    if (!session) {
      alert("Error creating math problem session. Please try again.");
      setIsLoading(false);
      return 0;
    }

    // Map JSON object response to Problem state
    setProblem({
      problem_text: response.problem_text,
      final_answer: response.final_answer
    });

    // Map Session ID to Session state
    setSessionId(session.session_id);

    // Set IsLoading to FALSE
    setIsLoading(false);
  }

  const submitAnswer = async (e: React.FormEvent) => {
    // TODO: Implement answer submission logic
    // This should call your API route to check the answer,
    // save the submission, and generate feedback
    e.preventDefault()

    if (parseFloat(userAnswer) === problem.final_answer) {

      setFeedback("Your answer is correct!")
      setIsCorrect(true)
      return;
    }

    setFeedback("Your answer is incorrect!")
    setIsCorrect(false)
    return;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Math Problem Generator
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <button
            onClick={generateProblem}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
          >
            {isLoading ? 'Generating...' : 'Generate New Problem'}
          </button>
        </div>

        {problem && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Problem:</h2>
            <p className="text-lg text-gray-800 leading-relaxed mb-6">
              {problem.problem_text}
            </p>
            
            <form onSubmit={submitAnswer} className="space-y-4">
              <div>
                <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Answer:
                </label>
                <input
                  type="number"
                  id="answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your answer"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={!userAnswer || isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
              >
                Submit Answer
              </button>
            </form>
          </div>
        )}

        {feedback && (
          <div className={`rounded-lg shadow-lg p-6 ${isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'}`}>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {isCorrect ? '✅ Correct!' : '❌ Not quite right'}
            </h2>
            <p className="text-gray-800 leading-relaxed">{feedback}</p>
          </div>
        )}
      </main>
    </div>
  )
}