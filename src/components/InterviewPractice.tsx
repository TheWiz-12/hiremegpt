import React, { useState, useEffect } from 'react';
import { useUserData } from '../context/UserDataContext';
import { generateInterviewQuestions, evaluateAnswer } from '../services/openai';
import { Loader, Send, MessageSquare, CheckCircle, Building } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-toastify';

const InterviewPractice: React.FC = () => {
  const { userProfile, saveInterviewSession, updateProfile } = useUserData();
  const [jobTitle, setJobTitle] = useState(userProfile?.jobTitle || '');
  const [company, setCompany] = useState('');
  const [numQuestions, setNumQuestions] = useState(25);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [sessionResults, setSessionResults] = useState<{ question: string; answer: string; feedback: string }[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    if (userProfile?.jobTitle && !jobTitle) {
      setJobTitle(userProfile.jobTitle);
    }
  }, [userProfile, jobTitle]);

  const handleGenerateQuestions = async () => {
    if (!jobTitle) {
      toast.error('Please enter a job title.');
      return;
    }

    if (!company) {
      toast.error('Please enter a company name.');
      return;
    }

    try {
      setLoading(true);
      
      if (userProfile && jobTitle !== userProfile.jobTitle) {
        await updateProfile({ jobTitle });
      }
      
      const resumeText = "Resume content would be extracted here"; 
      const result = await generateInterviewQuestions(jobTitle, company, resumeText, numQuestions);
      
      const parsedQuestions = result?.split(/\d+\.\s/).filter(q => q.trim().length > 0) || [];
      
      if (parsedQuestions.length === 0) {
        toast.error("Failed to generate questions. Please try again.");
        setLoading(false);
        return;
      }
      
      setQuestions(parsedQuestions);
      setCurrentQuestionIndex(0);
      setSessionResults([]);
      setSessionComplete(false);
      setFeedback('');
      setAnswer('');
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error("Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast.error("Please provide an answer before submitting.");
      return;
    }
    
    try {
      setFeedbackLoading(true);
      const result = await evaluateAnswer(questions[currentQuestionIndex], answer, jobTitle, company);
      setFeedback(result || '');
      
      const newSessionResults = [...sessionResults];
      newSessionResults[currentQuestionIndex] = {
        question: questions[currentQuestionIndex],
        answer,
        feedback: result || ''
      };
      setSessionResults(newSessionResults);
      
      if (currentQuestionIndex === questions.length - 1) {
        setSessionComplete(true);
        try {
          await saveInterviewSession(newSessionResults);
          toast.success("Interview session saved to your profile!");
        } catch (error) {
          console.error('Error saving session:', error);
          toast.error("Failed to save session to your profile.");
        }
      }
    } catch (error) {
      console.error('Error evaluating answer:', error);
      toast.error("Failed to evaluate answer. Please try again.");
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer('');
      setFeedback('');
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Interview Practice</h2>
      
      {questions.length === 0 ? (
        <div className="mb-6">
          <div className="mb-4">
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="input"
              placeholder="e.g., Software Engineer"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="input pl-10"
                placeholder="e.g., Google, Amazon, Microsoft"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Questions
            </label>
            <select
              id="numQuestions"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="input"
            >
              <option value={15}>15 Questions</option>
              <option value={25}>25 Questions</option>
              <option value={30}>30 Questions</option>
            </select>
          </div>
          
          <button
            onClick={handleGenerateQuestions}
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader className="animate-spin h-4 w-4 mr-2" />
                Generating Questions...
              </span>
            ) : 'Generate Interview Questions'}
          </button>
        </div>
      ) : sessionComplete ? (
        <div className="mb-6">
          <div className="flex items-center justify-center mb-6 text-primary-600">
            <CheckCircle className="h-12 w-12 mr-2" />
            <h3 className="text-xl font-medium">Practice Session Complete!</h3>
          </div>
          
          <div className="space-y-6">
            {sessionResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Question {index + 1}:</h4>
                <p className="mb-4">{result.question}</p>
                
                <h4 className="font-medium mb-2">Your Answer:</h4>
                <p className="mb-4 bg-gray-50 p-3 rounded">{result.answer}</p>
                
                <h4 className="font-medium mb-2">Feedback:</h4>
                <div className="bg-primary-50 p-3 rounded">
                  <ReactMarkdown>{result.feedback}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => {
              setQuestions([]);
              setSessionResults([]);
              setSessionComplete(false);
            }}
            className="btn btn-primary w-full mt-6"
          >
            Start New Practice Session
          </button>
        </div>
      ) : (
        <div className="mb-6">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Question {currentQuestionIndex + 1} of {questions.length}</h3>
              <span className="text-sm text-gray-500">Company: {company}</span>
            </div>
            
            <div className="bg-primary-50 p-4 rounded-lg mb-4">
              <ReactMarkdown>{questions[currentQuestionIndex]}</ReactMarkdown>
            </div>
            
            <div className="mb-4">
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
                Your Answer
              </label>
              <textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="input min-h-[120px]"
                placeholder="Type your answer here..."
                disabled={!!feedback}
              />
            </div>
            
            {!feedback ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!answer.trim() || feedbackLoading}
                className="btn btn-primary w-full flex items-center justify-center"
              >
                {feedbackLoading ? (
                  <span className="flex items-center">
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Answer
                  </span>
                )}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="border-l-4 border-primary-500 pl-4 py-2">
                  <h4 className="font-medium mb-2 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1 text-primary-600" />
                    Feedback
                  </h4>
                  <div className="text-gray-700">
                    <ReactMarkdown>{feedback}</ReactMarkdown>
                  </div>
                </div>
                
                <button
                  onClick={handleNextQuestion}
                  className="btn btn-primary w-full"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Session'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPractice;