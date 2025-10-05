# Math Problem Generator - Developer Assessment Starter Kit

## Overview

This is a starter kit for building an AI-powered math problem generator application. The goal is to create a standalone prototype that uses AI to generate math word problems suitable for Primary 5 students, saves the problems and user submissions to a database, and provides personalized feedback.

## Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **AI Integration**: Google Generative AI (Gemini)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd math-problem-generator
```

### 2. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings → API to find your:
   - Project URL (starts with `https://`)
   - Anon/Public Key

### 3. Set Up Database Tables

1. In your Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `database.sql`
3. Click "Run" to create the tables and policies

### 4. Get Google API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key for Gemini

### 5. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Edit `.env.local` and add your actual keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   GOOGLE_API_KEY=your_actual_google_api_key
   ```

### 6. Install Dependencies

```bash
npm install
```

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Your Task

### 1. Implement Frontend Logic (`app/page.tsx`)

Complete the TODO sections in the main page component:

- **generateProblem**: Call your API route to generate a new math problem
- **submitAnswer**: Submit the user's answer and get feedback

### 2. Create Backend API Route (`app/api/math-problem/route.ts`)

Create a new API route that handles:

#### POST /api/math-problem (Generate Problem)
- Use Google's Gemini AI to generate a math word problem
- The AI should return JSON with:
  ```json
  {
    "problem_text": "A bakery sold 45 cupcakes...",
    "final_answer": 15
  }
  ```
- Save the problem to `math_problem_sessions` table
- Return the problem and session ID to the frontend

#### POST /api/math-problem/submit (Submit Answer)
- Receive the session ID and user's answer
- Check if the answer is correct
- Use AI to generate personalized feedback based on:
  - The original problem
  - The correct answer
  - The user's answer
  - Whether they got it right or wrong
- Save the submission to `math_problem_submissions` table
- Return the feedback and correctness to the frontend

### 3. Requirements Checklist

- [X] AI generates appropriate Primary 5 level math problems
- [X] Problems and answers are saved to Supabase
- [X] User submissions are saved with feedback
- [X] AI generates helpful, personalized feedback
- [X] UI is clean and mobile-responsive
- [X] Error handling for API failures
- [X] Loading states during API calls

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add your environment variables in Vercel's project settings
4. Deploy!

## Assessment Submission

When submitting your assessment, provide:

1. **GitHub Repository URL**: Make sure it's public
2. **Live Demo URL**: [Your Vercel deployment](https://ottodot-project.vercel.app/)
3. **Supabase Credentials**: Add these to your README for testing:
   ```
   SUPABASE_URL: https://ipcaipiesghzehcoltsg.supabase.co
   SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwY2FpcGllc2doemVoY29sdHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NjA1MDUsImV4cCI6MjA3NTAzNjUwNX0.G5DzAEhyoZVJXu1ceJSGcPw_QbYyXRmQ0BPSO4N_BH8
   ```

## Implementation Notes

*Please fill in this section with any important notes about your implementation, design decisions, challenges faced, or features you're particularly proud of.*

### My Implementation:

- I added a part where the session ID is stored in a local storage in cases of the user generated a problem, but was not able to answer let say for example if the user closed the browser. The system will take them back to the last problem they are working on and will only change if they decide to generate a new math problem.
- The feature I enjoyed working on the most is implementing the Google Gemini API. Most of my experience with AI is with Amazons AI Agents from Amazon Bedrock.
The concise and explanations and documentations made it a lot easy for me to get used to and even just a couple of days, I have gained so much knowledge on it.
- I enjoyed fiddling with what the GenAI library has to offer with its flexibility with inputs and also offering structured outputs which made implementing
problem and feedback generation easy.
- From the get-go, there were only minimal instances were I got stuck. Most of it has got something to do with the type-safety TypeScript offers, but it does make 
the system more streamline because of you will already get the idea on the data flow from one component to another.
- One of the challenges I faced is having to refactor all the database transactions API calls because I overlooked the part on the code about the backend
implementation where the APIs should be implemented as routes. I quickly updated all the code to be aligned with the instructions and even having done that, it
still made sense to make the APIs as a route to allow scalability in situations where other components would need to do the same transactions.
- The whole environment using Vercel and Supabase, and Google's Gemini is very user friendly and I did come to realize that most of the people in this industry
say it is true that those offers a very user friendly approach.

## Additional Features (Optional)

If you have time, consider adding:

- [ ] Difficulty levels (Easy/Medium/Hard)
- [ ] Problem history view
- [ ] Score tracking
- [ ] Different problem types (addition, subtraction, multiplication, division)
- [ ] Hints system
- [ ] Step-by-step solution explanations

---

Good luck with your assessment! 🎯