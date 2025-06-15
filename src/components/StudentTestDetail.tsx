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

  // Calculate time taken as total time - remaining time
  const calculateTimeTaken = () => {
    const totalTimeInSeconds = test.duration * 60;
    const remainingTime = result.remaining_time || 0;
    const timeTakenInSeconds = totalTimeInSeconds - remainingTime;
    
    const minutes = Math.floor(timeTakenInSeconds / 60);
    const seconds = timeTakenInSeconds % 60;
    
    return `${minutes}m ${seconds}s`;
  };

  // Add comprehensive debugging
  console.log('=== DEBUGGING TEST RESULT DATA ===');
  console.log('Full test object:', test);
  console.log('Full result object:', result);
  console.log('Result answers array:', result.answers);
  console.log('Test questions array:', test.questions);
  console.log('Test duration:', test.duration);
  console.log('Remaining time:', result.remaining_time);
  console.log('Calculated time taken:', calculateTimeTaken());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            onClick={onBack}
            variant="outline" 
            className="flex items-center gap-2 bg-white/70 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
          >
            <ArrowLeft size={16} />
            Back to Results
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {test.title}
            </h1>
            <p className="text-gray-600 mt-1">Review your test performance and answers</p>
          </div>
        </div>

        {/* Performance Summary - More Compact Layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm border-0 modern-shadow hover-lift">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <Badge variant={getScoreBadgeVariant(result.score)} className="text-xs">
                  {result.score >= 60 ? 'Pass' : 'Fail'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{getScoreEmoji(result.score)}</span>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {result.score}%
                </div>
              </div>
              <p className="text-xs text-gray-600 font-medium">{getPerformanceMessage(result.score)}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 modern-shadow hover-lift">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Correct</span>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                {result.correct_answers}/{result.total_questions}
              </div>
              <p className="text-xs text-gray-600 font-medium">Questions answered correctly</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 modern-shadow hover-lift">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Duration</span>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                {calculateTimeTaken()}
              </div>
              <p className="text-xs text-gray-600 font-medium">Time taken</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 modern-shadow hover-lift">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Completed</span>
              </div>
              <div className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-1">
                {new Date(result.completed_at).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <p className="text-xs text-gray-600 font-medium">Submission date</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Test Information - Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/90 backdrop-blur-sm border-0 modern-shadow sticky top-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <FileText size={16} className="text-white" />
                  </div>
                  Test Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                  <Target className="h-4 w-4 text-purple-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-600">Subject</span>
                    <p className="font-semibold text-gray-900">{test.subject || 'General'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-600">Questions</span>
                    <p className="font-semibold text-gray-900">{test.questions.length} total</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                  <Clock className="h-4 w-4 text-green-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-600">Time Limit</span>
                    <p className="font-semibold text-gray-900">{test.duration} minutes</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                  <Award className="h-4 w-4 text-orange-500" />  
                  <div>
                    <span className="text-sm font-medium text-gray-600">Passing Score</span>
                    <p className="font-semibold text-gray-900">40%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Review - Main Content */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm border-0 modern-shadow">
              <CardHeader>
                <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <FileText size={18} className="text-white" />
                  </div>
                  Question Review
                </CardTitle>
                <CardDescription className="text-gray-600">Review your answers for each question</CardDescription>
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
                        className={`border-l-4 ${isCorrect ? 'border-l-green-500 bg-green-50/50' : 'border-l-red-500 bg-red-50/50'} transition-all duration-300`}
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
                                <h4 className="text-lg font-semibold text-gray-900">Question {index + 1}</h4>
                                <Badge variant={isCorrect ? 'default' : 'destructive'} className="font-medium">
                                  {isCorrect ? 'Correct' : 'Incorrect'}
                                </Badge>
                              </div>
                              
                              <p className="text-gray-800 mb-4 font-medium leading-relaxed">{question.question}</p>
                              
                              {/* Answer Summary - Improved Layout */}
                              <div className="mb-4 space-y-3">
                                <div className="grid grid-cols-1 gap-3">
                                  <div>
                                    <h5 className="text-sm font-semibold text-gray-600 mb-2">Your Answer:</h5>
                                    <div className={`p-3 rounded-lg border-2 ${
                                      isCorrect ? 'bg-green-100 border-green-300 text-green-800' : 'bg-red-100 border-red-300 text-red-800'
                                    }`}>
                                      <div className="flex items-center gap-2">
                                        {isCorrect ? (
                                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                        ) : (
                                          <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                                        )}
                                        <span className="font-medium">
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
                                      <h5 className="text-sm font-semibold text-gray-600 mb-2">Correct Answer:</h5>
                                      <div className="p-3 rounded-lg border-2 bg-green-100 border-green-300 text-green-800">
                                        <div className="flex items-center gap-2">
                                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                          <span className="font-medium">
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
                                <h5 className="text-sm font-semibold text-gray-600 mb-2">All Options:</h5>
                                {question.options.map((option: string, optionIndex: number) => {
                                  const isUserAnswer = userSelectedIndex === optionIndex;
                                  const isCorrectAnswer = correctAnswerIndex === optionIndex;
                                  
                                  let optionClass = 'p-3 rounded-lg border transition-all duration-200 ';
                                  if (isCorrectAnswer) {
                                    optionClass += 'bg-green-100 border-green-300 text-green-800 font-medium';
                                  } else if (isUserAnswer && !isCorrect) {
                                    optionClass += 'bg-red-100 border-red-300 text-red-800 font-medium';
                                  } else {
                                    optionClass += 'bg-gray-50 border-gray-200 text-gray-700';
                                  }
                                  
                                  return (
                                    <div key={optionIndex} className={optionClass}>
                                      <div className="flex items-center gap-3">
                                        {isCorrectAnswer && <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />}
                                        {isUserAnswer && !isCorrect && <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />}
                                        <span className="font-bold text-sm">{String.fromCharCode(65 + optionIndex)}.</span>
                                        <span className="flex-1">{option}</span>
                                        <div className="flex gap-1">
                                          {isUserAnswer && (
                                            <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-800">
                                              Your Choice
                                            </span>
                                          )}
                                          {isCorrectAnswer && (
                                            <span className="text-xs font-semibold px-2 py-1 rounded bg-green-200 text-green-800">
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
                              <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
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
