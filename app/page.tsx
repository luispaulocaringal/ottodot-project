'use client'

import React, { useState, useEffect } from 'react'

interface MathProblem {
  problem_text: string
  final_answer: number
}

interface Response {
  success: number
  message: any
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_LOCALHOST_API_URL}/math-problem?id=${sessionId}`);
        const json:Response = await response.json();

        // Set JSON object response to Problem state
        setProblem({
          problem_text: json.message.problem_text,
          final_answer: json.message.correct_answer
        });

        // Set Session ID to Session state
        setSessionId(json.message.id);
      }
      fetchData();
    }

    setIsLoading(false);
  }, [])

  const generateProblem = async () => {
    // TODO: Implement problem generation logic
    // This should call your API route to generate a new problem
    // and save it to the database

    // Reset states
    setFeedback('');
    setIsCorrect(null);
    setUserAnswer('');

    // Set IsLoading to TRUE
    setIsLoading(true);

    // Call create math problem API
    const response = await fetch(`${process.env.NEXT_PUBLIC_LOCALHOST_API_URL}/math-problem`);
    const json:Response = await response.json();

    // Error handler
    if (!json.success) {
      alert(json.message);
      setIsLoading(false);
      return 0;
    }

    // Set Problem
    setProblem({
      problem_text: json.message.problem_text,
      final_answer: json.message.correct_answer,
    });

    // Set Session ID
    localStorage.setItem('sessionId', json.message.id);
    setSessionId(json.message.id);

    // Set IsLoading to FALSE
    setIsLoading(false);
    return;
  }

  const submitAnswer = async (e: React.FormEvent) => {
    // TODO: Implement answer submission logic
    // This should call your API route to check the answer,
    // save the submission, and generate feedback
    e.preventDefault();

    // Set IsLoading to TRUE
    setIsLoading(true);

    // Create body
    const payload = {
      problem: problem.problem_text,
      userAnswer: userAnswer,
    }

    // Call create math problem API
    const response = await fetch(`${process.env.NEXT_PUBLIC_LOCALHOST_API_URL}/math-problem/submit?id=${sessionId}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const json:Response = await response.json();

    // Error handler
    if (!json.success) {
      alert(json.message);
      setIsLoading(false);
      return 0;
    }

    // Set feedback and is correct state
    setIsCorrect(json.message.is_correct);
    setFeedback(json.message.feedback_text);

    // Unset session after user submission
    localStorage.removeItem('sessionId');
    setSessionId(null);

    // Set IsLoading to FALSE
    setIsLoading(false);
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