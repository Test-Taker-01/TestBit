
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ArrowLeft, Clock, User, BookOpen, Award } from 'lucide-react';

interface DetailedTestResultProps {
  result: any;
  test: any;
  studentName: string;
  onBack: () => void;
}

const DetailedTestResult: React.FC<DetailedTestResultProps> = ({ 
  result, 
  test, 
  studentName, 
  onBack 
}) => {
  const answers = result.answers || [];
  const scorePercentage = result.score;
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Results
        </Button>
        <div className="text-right">
          <h1 className="text-3xl font-bold text-gray-900">Test Result Details</h1>
          <p className="text-gray-600">Comprehensive analysis of performance</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <User className="text-blue-600" size={20} />
              <CardTitle className="text-lg">Student</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="font-semibold text-lg">{studentName}</p>
              <p className="text-sm text-gray-600">ID: {result.student_id?.slice(-8) || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="text-green-600" size={20} />
              <CardTitle className="text-lg">Test Info</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="font-semibold">{test?.title || 'Unknown Test'}</p>
              <p className="text-sm text-gray-600">{test?.subject || 'General'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Award className="text-purple-600" size={20} />
              <CardTitle className="text-lg">Performance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`inline-flex items-center px-3 py-1 rounded-full border ${getScoreColor(scorePercentage)}`}>
                <span className="font-bold text-2xl">{scorePercentage}%</span>
              </div>
              <p className="text-sm text-gray-600">{result.correct_answers}/{result.total_questions} correct</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="text-orange-600" size={20} />
              <CardTitle className="text-lg">Time</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="font-semibold text-lg">{result.time_taken || 'N/A'}</p>
              <p className="text-sm text-gray-600">{new Date(result.completed_at).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="text-blue-600" size={24} />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{result.correct_answers}</div>
              <div className="text-sm font-medium text-gray-600">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{result.total_questions - result.correct_answers}</div>
              <div className="text-sm font-medium text-gray-600">Incorrect Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{Math.round((result.correct_answers / result.total_questions) * 100)}%</div>
              <div className="text-sm font-medium text-gray-600">Accuracy Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Question-by-Question Analysis</CardTitle>
          <CardDescription>
            Detailed breakdown of each question and answer with explanations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {answers.map((answer: any, index: number) => {
              const question = test?.questions?.[index];
              if (!question) return null;

              return (
                <div key={index} className={`border-2 rounded-lg p-6 transition-all ${
                  answer.isCorrect 
                    ? 'border-green-200 bg-green-50/50' 
                    : 'border-red-200 bg-red-50/50'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                          Question {index + 1}
                        </span>
                        <Badge variant={answer.isCorrect ? 'default' : 'destructive'} className="flex items-center gap-1">
                          {answer.isCorrect ? (
                            <CheckCircle size={14} />
                          ) : (
                            <XCircle size={14} />
                          )}
                          {answer.isCorrect ? 'Correct' : 'Incorrect'}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-lg text-gray-900 leading-relaxed">
                        {question.question}
                      </h4>
                    </div>
                  </div>

                  {question.image && (
                    <div className="flex justify-center mb-4">
                      <img
                        src={question.image}
                        alt="Question illustration"
                        className="max-w-full max-h-48 object-contain rounded-lg border shadow-sm"
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Answer Options Display */}
                    <div className="grid gap-3">
                      {question.options?.map((option: string, optionIndex: number) => {
                        const isSelected = answer.selectedOption === option;
                        const isCorrect = answer.correctOption === option;
                        
                        let optionClass = 'p-3 rounded-lg border-2 transition-all ';
                        if (isSelected && isCorrect) {
                          optionClass += 'border-green-500 bg-green-100 text-green-800';
                        } else if (isSelected && !isCorrect) {
                          optionClass += 'border-red-500 bg-red-100 text-red-800';
                        } else if (isCorrect) {
                          optionClass += 'border-green-500 bg-green-50 text-green-700';
                        } else {
                          optionClass += 'border-gray-200 bg-gray-50 text-gray-600';
                        }

                        return (
                          <div key={optionIndex} className={optionClass}>
                            <div className="flex items-center gap-3">
                              <span className="font-medium">
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              <span className="flex-1">{option}</span>
                              {isSelected && (
                                <span className="text-sm font-medium">
                                  Your Answer
                                </span>
                              )}
                              {isCorrect && (
                                <CheckCircle className="text-green-600" size={18} />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Answer Summary */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Your Answer:</label>
                          <div className={`mt-1 p-2 rounded border-2 ${
                            answer.isCorrect 
                              ? 'border-green-300 bg-green-50 text-green-800' 
                              : 'border-red-300 bg-red-50 text-red-800'
                          }`}>
                            {answer.selectedOption || 'No answer selected'}
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-600">Correct Answer:</label>
                          <div className="mt-1 p-2 rounded border-2 border-green-300 bg-green-50 text-green-800">
                            {answer.correctOption}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedTestResult;
