
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Award, Clock, Calendar, CheckCircle, XCircle, FileText, Target } from 'lucide-react';

interface StudentTestDetailProps {
  test: any;
  result: any;
  onBack: () => void;
}

const StudentTestDetail: React.FC<StudentTestDetailProps> = ({ test, result, onBack }) => {
  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '🏆';
    if (score >= 80) return '🥇';
    if (score >= 70) return '🥈';
    if (score >= 60) return '🥉';
    return '📚';
  };

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return 'Outstanding performance!';
    if (score >= 80) return 'Excellent work!';
    if (score >= 70) return 'Good job!';
    if (score >= 60) return 'Well done!';
    return 'Keep practicing!';
  };

  // Improved time taken calculation with better edge case handling
  const calculateTimeTaken = () => {
    // Get test duration in seconds
    const totalTimeInSeconds = (test.duration || 0) * 60;
    
    // Get remaining time, handle different possible formats
    let remainingTimeInSeconds = 0;
    
    if (result.remaining_time !== undefined && result.remaining_time !== null) {
      // If remaining_time is already in seconds
      if (typeof result.remaining_time === 'number') {
        remainingTimeInSeconds = Math.max(0, result.remaining_time);
      }
      // If remaining_time is a string like "25:30" (mm:ss format)
      else if (typeof result.remaining_time === 'string' && result.remaining_time.includes(':')) {
        const parts = result.remaining_time.split(':');
        if (parts.length === 2) {
          const minutes = parseInt(parts[0]) || 0;
          const seconds = parseInt(parts[1]) || 0;
          remainingTimeInSeconds = Math.max(0, (minutes * 60) + seconds);
        }
      }
    }
    
    // Calculate time actually used
    const timeTakenInSeconds = Math.max(0, totalTimeInSeconds - remainingTimeInSeconds);
    
    // If somehow we have invalid data, show the stored time_taken if available
    if (timeTakenInSeconds === 0 && result.time_taken) {
      return result.time_taken;
    }
    
    // Format the time nicely
    const hours = Math.floor(timeTakenInSeconds / 3600);
    const minutes = Math.floor((timeTakenInSeconds % 3600) / 60);
    const seconds = timeTakenInSeconds % 60;
    
    // Format based on duration
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Add comprehensive debugging
  console.log('=== DEBUGGING TEST RESULT DATA ===');
  console.log('Full test object:', test);
  console.log('Full result object:', result);
  console.log('Result answers array:', result.answers);
  console.log('Test questions array:', test.questions);
  console.log('Test duration:', test.duration);
  console.log('Remaining time:', result.remaining_time);
  console.log('Stored time_taken:', result.time_taken);
  console.log('Calculated time taken:', calculateTimeTaken());

  return (
    <div className="min-h-screen classic-warm-gradient p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            onClick={onBack}
            variant="outline" 
            className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border-accent text-foreground hover:bg-accent hover:border-primary transition-all duration-300 proper-line-height"
          >
            <ArrowLeft size={16} />
            Back to Results
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground header-text">
              {test.title}
            </h1>
            <p className="text-muted-foreground mt-1 proper-line-height">Review your test performance and answers</p>
          </div>
        </div>

        {/* Performance Summary - More Compact Layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/90 backdrop-blur-sm hover-lift border border-accent modern-shadow transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 classic-accent-gradient rounded-lg modern-shadow">
                  <Award className="h-4 w-4 text-amber-900" />
                </div>
                <Badge variant={getScoreBadgeVariant(result.score)} className="text-xs proper-line-height">
                  {result.score >= 60 ? 'Pass' : 'Fail'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{getScoreEmoji(result.score)}</span>
                <div className="text-2xl font-bold text-primary header-text">
                  {result.score}%
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-medium proper-line-height">{getPerformanceMessage(result.score)}</p>
            </CardContent>
          </Card>

          <Card className="bg-card/90 backdrop-blur-sm hover-lift border border-accent modern-shadow transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 classic-accent-gradient rounded-lg modern-shadow">
                  <CheckCircle className="h-4 w-4 text-amber-900" />
                </div>
                <span className="text-xs text-muted-foreground font-medium proper-line-height">Correct</span>
              </div>
              <div className="text-2xl font-bold text-primary header-text mb-1">
                {result.correct_answers}/{result.total_questions}
              </div>
              <p className="text-xs text-muted-foreground font-medium proper-line-height">Questions answered correctly</p>
            </CardContent>
          </Card>

          <Card className="bg-card/90 backdrop-blur-sm hover-lift border border-accent modern-shadow transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 classic-accent-gradient rounded-lg modern-shadow">
                  <Clock className="h-4 w-4 text-amber-900" />
                </div>
                <span className="text-xs text-muted-foreground font-medium proper-line-height">Duration</span>
              </div>
              <div className="text-2xl font-bold text-primary header-text mb-1">
                {calculateTimeTaken()}
              </div>
              <p className="text-xs text-muted-foreground font-medium proper-line-height">Time taken</p>
            </CardContent>
          </Card>

          <Card className="bg-card/90 backdrop-blur-sm hover-lift border border-accent modern-shadow transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 classic-accent-gradient rounded-lg modern-shadow">
                  <Calendar className="h-4 w-4 text-amber-900" />
                </div>
                <span className="text-xs text-muted-foreground font-medium proper-line-height">Completed</span>
              </div>
              <div className="text-lg font-bold text-primary header-text mb-1">
                {new Date(result.completed_at).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <p className="text-xs text-muted-foreground font-medium proper-line-height">Submission date</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Test Information - Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-card/90 backdrop-blur-sm border border-accent modern-shadow sticky top-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-foreground flex items-center gap-2 header-text">
                  <div className="p-1.5 classic-accent-gradient rounded-lg modern-shadow">
                    <FileText size={16} className="text-amber-900" />
                  </div>
                  Test Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                  <Target className="h-4 w-4 text-amber-700" />
                  <div>
                    <span className="text-sm font-medium text-muted-foreground proper-line-height">Subject</span>
                    <p className="font-semibold text-foreground proper-line-height">{test.subject || 'General'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                  <FileText className="h-4 w-4 text-amber-700" />
                  <div>
                    <span className="text-sm font-medium text-muted-foreground proper-line-height">Questions</span>
                    <p className="font-semibold text-foreground proper-line-height">{test.questions.length} total</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                  <Clock className="h-4 w-4 text-amber-700" />
                  <div>
                    <span className="text-sm font-medium text-muted-foreground proper-line-height">Time Limit</span>
                    <p className="font-semibold text-foreground proper-line-height">{test.duration} minutes</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                  <Award className="h-4 w-4 text-amber-700" />  
                  <div>
                    <span className="text-sm font-medium text-muted-foreground proper-line-height">Passing Score</span>
                    <p className="font-semibold text-foreground proper-line-height">40%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Review - Main Content */}
          <div className="lg:col-span-2">
            <Card className="bg-card/90 backdrop-blur-sm border border-accent modern-shadow">
              <CardHeader>
                <CardTitle className="text-xl text-foreground flex items-center gap-3 header-text">
                  <div className="p-2 classic-accent-gradient rounded-lg modern-shadow">
                    <FileText size={18} className="text-amber-900" />
                  </div>
                  Question Review
                </CardTitle>
                <CardDescription className="text-muted-foreground proper-line-height">Review your answers for each question</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {test.questions.map((question: any, index: number) => {
                    // Find user answer - try multiple possible structures and indices
                    const userAnswer = result.answers.find((answer: any) => {
                      // Try different matching strategies
                      return answer.questionIndex === index || 
                             answer.questionId === index ||
                             answer.question === index ||
                             answer.questionIndex === (index + 1) ||
                             answer.questionId === (index + 1) ||
                             answer.question === (index + 1) ||
                             (answer.questionId === question.id) ||
                             (result.answers.indexOf(answer) === index);
                    });
                    
                    // Enhanced debug logging
                    console.log(`\n=== Question ${index + 1} Debug ===`);
                    console.log('Question object:', question);
                    console.log('Question ID:', question.id);
                    console.log('User answer object:', userAnswer);
                    console.log('All answers for debugging:', result.answers.map((a: any, i: number) => ({
                      index: i,
                      questionIndex: a.questionIndex,
                      questionId: a.questionId,
                      selectedAnswer: a.selectedAnswer,
                      answer: a.answer,
                      selected: a.selected
                    })));
                    
                    // Try multiple ways to get the user's selected answer
                    let userSelectedAnswer = userAnswer?.selectedAnswer ?? userAnswer?.answer ?? userAnswer?.selected;
                    
                    // If we still don't have an answer, try by array position
                    if (userSelectedAnswer === undefined && result.answers[index]) {
                      userSelectedAnswer = result.answers[index].selectedAnswer ?? result.answers[index].answer ?? result.answers[index].selected;
                      console.log('Trying array position fallback:', userSelectedAnswer);
                    }
                    
                    console.log('Question.correctAnswer:', question.correctAnswer, 'Type:', typeof question.correctAnswer);
                    console.log('Final userSelectedAnswer:', userSelectedAnswer, 'Type:', typeof userSelectedAnswer);
                    
                    // Convert to number for comparison - handle string numbers too
                    const userSelectedIndex = userSelectedAnswer !== undefined ? Number(userSelectedAnswer) : -1;
                    const correctAnswerIndex = Number(question.correctAnswer);
                    
                    console.log('Final comparison:');
                    console.log('userSelectedIndex:', userSelectedIndex);
                    console.log('correctAnswerIndex:', correctAnswerIndex);
                    console.log('Are equal?:', userSelectedIndex === correctAnswerIndex);
                    
                    // Determine if answer is correct
                    const isCorrect = !isNaN(userSelectedIndex) && 
                                     !isNaN(correctAnswerIndex) && 
                                     userSelectedIndex >= 0 &&
                                     userSelectedIndex === correctAnswerIndex;
                    
                    console.log('Final isCorrect result:', isCorrect);
                    console.log('=== End Question Debug ===\n');
                    
                    return (
                      <Card 
                        key={index} 
                        className={`border-l-4 ${isCorrect ? 'border-l-green-500 bg-green-50/50' : 'border-l-red-500 bg-red-50/50'} bg-card/95 backdrop-blur-sm hover-lift border border-accent transition-all duration-300 modern-shadow`}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-full ${isCorrect ? 'bg-green-100' : 'bg-red-100'} flex-shrink-0`}>
                              {isCorrect ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-lg font-semibold text-foreground header-text">Question {index + 1}</h4>
                                <Badge variant={isCorrect ? 'default' : 'destructive'} className="font-medium proper-line-height">
                                  {isCorrect ? 'Correct' : 'Incorrect'}
                                </Badge>
                              </div>
                              
                              <p className="text-foreground mb-4 font-medium proper-line-height">{question.question}</p>
                              
                              {/* Answer Summary - Improved Layout */}
                              <div className="mb-4 space-y-3">
                                <div className="grid grid-cols-1 gap-3">
                                  <div>
                                    <h5 className="text-sm font-semibold text-muted-foreground mb-2 proper-line-height">Your Answer:</h5>
                                    <div className={`p-3 rounded-lg border-2 ${
                                      isCorrect ? 'bg-green-100 border-green-300 text-green-800' : 'bg-red-100 border-red-300 text-red-800'
                                    }`}>
                                      <div className="flex items-center gap-2">
                                        {isCorrect ? (
                                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                        ) : (
                                          <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                                        )}
                                        <span className="font-medium proper-line-height">
                                          {userSelectedIndex >= 0 && userSelectedIndex < question.options.length 
                                            ? `${String.fromCharCode(65 + userSelectedIndex)}. ${question.options[userSelectedIndex]}`
                                            : 'No answer selected'
                                          }
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {!isCorrect && (
                                    <div>
                                      <h5 className="text-sm font-semibold text-muted-foreground mb-2 proper-line-height">Correct Answer:</h5>
                                      <div className="p-3 rounded-lg border-2 bg-green-100 border-green-300 text-green-800">
                                        <div className="flex items-center gap-2">
                                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                          <span className="font-medium proper-line-height">
                                            {correctAnswerIndex >= 0 && correctAnswerIndex < question.options.length
                                              ? `${String.fromCharCode(65 + correctAnswerIndex)}. ${question.options[correctAnswerIndex]}`
                                              : 'Invalid correct answer'
                                            }
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* All Options Display - More Compact */}
                              <div className="space-y-2">
                                <h5 className="text-sm font-semibold text-muted-foreground mb-2 proper-line-height">All Options:</h5>
                                {question.options.map((option: string, optionIndex: number) => {
                                  const isUserAnswer = userSelectedIndex === optionIndex;
                                  const isCorrectAnswer = correctAnswerIndex === optionIndex;
                                  
                                  let optionClass = 'p-3 rounded-lg border transition-all duration-200 ';
                                  if (isCorrectAnswer) {
                                    optionClass += 'bg-green-100 border-green-300 text-green-800 font-medium';
                                  } else if (isUserAnswer && !isCorrect) {
                                    optionClass += 'bg-red-100 border-red-300 text-red-800 font-medium';
                                  } else {
                                    optionClass += 'bg-accent/30 border-accent text-foreground';
                                  }
                                  
                                  return (
                                    <div key={optionIndex} className={optionClass}>
                                      <div className="flex items-center gap-3">
                                        {isCorrectAnswer && <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />}
                                        {isUserAnswer && !isCorrect && <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />}
                                        <span className="font-bold text-sm">{String.fromCharCode(65 + optionIndex)}.</span>
                                        <span className="flex-1 proper-line-height">{option}</span>
                                        <div className="flex gap-1">
                                          {isUserAnswer && (
                                            <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-800 proper-line-height">
                                              Your Choice
                                            </span>
                                          )}
                                          {isCorrectAnswer && (
                                            <span className="text-xs font-semibold px-2 py-1 rounded bg-green-200 text-green-800 proper-line-height">
                                              Correct
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              
                              {/* Debug info (remove this in production) */}
                              <div className="mt-4 p-2 bg-accent/30 rounded text-xs text-muted-foreground proper-line-height">
                                DEBUG: User selected: {userSelectedAnswer} | Correct: {question.correctAnswer} | Match: {isCorrect ? 'YES' : 'NO'} | Question ID: {question.id}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTestDetail;
