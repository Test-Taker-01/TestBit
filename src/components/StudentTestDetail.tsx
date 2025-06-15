
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          onClick={onBack}
          variant="outline" 
          className="flex items-center gap-2 bg-white/70 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
        >
          <ArrowLeft size={16} />
          Back to Results
        </Button>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {test.title} - Test Details
          </h2>
          <p className="text-gray-600 mt-1">Review your performance and answers</p>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 modern-shadow hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Your Score</CardTitle>
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Award className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{getScoreEmoji(result.score)}</span>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {result.score}%
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-1 font-medium">{getPerformanceMessage(result.score)}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 modern-shadow hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Correct Answers</CardTitle>
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {result.correct_answers}/{result.total_questions}
            </div>
            <p className="text-xs text-gray-600 mt-1 font-medium">Questions answered correctly</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 modern-shadow hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Time Taken</CardTitle>
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {result.time_taken || 'N/A'}
            </div>
            <p className="text-xs text-gray-600 mt-1 font-medium">Duration</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 modern-shadow hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Completed</CardTitle>
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
              <Calendar className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {new Date(result.completed_at).toLocaleDateString()}
            </div>
            <p className="text-xs text-gray-600 mt-1 font-medium">Submission date</p>
          </CardContent>
        </Card>
      </div>

      {/* Test Information */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 modern-shadow">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <FileText size={18} className="text-white" />
            </div>
            Test Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-purple-500" />
                <div>
                  <span className="text-sm font-medium text-gray-600">Subject</span>
                  <p className="font-semibold text-gray-900">{test.subject || 'General'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="text-sm font-medium text-gray-600">Total Questions</span>
                  <p className="font-semibold text-gray-900">{test.questions.length}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-green-500" />
                <div>
                  <span className="text-sm font-medium text-gray-600">Duration</span>
                  <p className="font-semibold text-gray-900">{test.duration} minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-orange-500" />
                <div>
                  <span className="text-sm font-medium text-gray-600">Passing Score</span>
                  <p className="font-semibold text-gray-900">60%</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Review */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 modern-shadow">
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
              const userAnswer = result.answers.find((answer: any) => answer.questionIndex === index);
              const isCorrect = userAnswer?.isCorrect || false;
              
              return (
                <Card 
                  key={index} 
                  className={`border-l-4 ${isCorrect ? 'border-l-green-500 bg-green-50/50' : 'border-l-red-500 bg-red-50/50'} transition-all duration-300`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-full ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-semibold text-gray-900">Question {index + 1}</h4>
                          <Badge variant={isCorrect ? 'default' : 'destructive'} className="font-medium">
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-800 mb-4 font-medium">{question.question}</p>
                        
                        <div className="space-y-2">
                          {question.options.map((option: string, optionIndex: number) => {
                            const isUserAnswer = userAnswer?.selectedAnswer === optionIndex;
                            const isCorrectAnswer = question.correctAnswer === optionIndex;
                            
                            let optionClass = 'p-3 rounded-lg border ';
                            if (isCorrectAnswer) {
                              optionClass += 'bg-green-100 border-green-300 text-green-800 font-medium';
                            } else if (isUserAnswer && !isCorrect) {
                              optionClass += 'bg-red-100 border-red-300 text-red-800 font-medium';
                            } else {
                              optionClass += 'bg-gray-50 border-gray-200 text-gray-700';
                            }
                            
                            return (
                              <div key={optionIndex} className={optionClass}>
                                <div className="flex items-center gap-2">
                                  {isCorrectAnswer && <CheckCircle className="h-4 w-4 text-green-600" />}
                                  {isUserAnswer && !isCorrect && <XCircle className="h-4 w-4 text-red-600" />}
                                  <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span>
                                  <span>{option}</span>
                                  {isUserAnswer && <span className="text-xs font-semibold ml-auto">(Your answer)</span>}
                                  {isCorrectAnswer && <span className="text-xs font-semibold ml-auto">(Correct answer)</span>}
                                </div>
                              </div>
                            );
                          })}
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
  );
};

export default StudentTestDetail;
