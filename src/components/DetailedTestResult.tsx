
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Results
        </Button>
        <div className="text-right">
          <h1 className="text-2xl font-bold">Test Result Details</h1>
          <p className="text-gray-600">Detailed breakdown of answers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Name:</span> {studentName}
              </div>
              <div>
                <span className="font-medium">Student ID:</span> {result.studentId}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Test Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Test:</span> {test?.title || 'Unknown Test'}
              </div>
              <div>
                <span className="font-medium">Subject:</span> {test?.subject || 'General'}
              </div>
              <div>
                <span className="font-medium">Date:</span> {new Date(result.completedAt).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Score:</span>{' '}
                <Badge variant={result.score >= 80 ? 'default' : result.score >= 60 ? 'secondary' : 'destructive'}>
                  {result.score}%
                </Badge>
              </div>
              <div>
                <span className="font-medium">Correct:</span> {result.correctAnswers}/{result.totalQuestions}
              </div>
              <div>
                <span className="font-medium">Time:</span> {result.timeTaken || 'N/A'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Question-by-Question Analysis</CardTitle>
          <CardDescription>
            Detailed breakdown of each question and answer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {answers.map((answer: any, index: number) => {
              const question = test?.questions?.[index];
              if (!question) return null;

              return (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-lg">
                        Question {index + 1}
                      </h4>
                      <p className="text-gray-700 mt-1">{question.question}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {answer.isCorrect ? (
                        <CheckCircle className="text-green-600" size={24} />
                      ) : (
                        <XCircle className="text-red-600" size={24} />
                      )}
                      <Badge variant={answer.isCorrect ? 'default' : 'destructive'}>
                        {answer.isCorrect ? 'Correct' : 'Incorrect'}
                      </Badge>
                    </div>
                  </div>

                  {question.image && (
                    <div className="flex justify-center">
                      <img
                        src={question.image}
                        alt="Question"
                        className="max-w-full max-h-32 object-contain rounded border"
                      />
                    </div>
                  )}

                  <div className="grid gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium text-sm text-gray-600">Your Answer:</span>
                        <div className={`p-2 rounded border ${
                          answer.isCorrect 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}>
                          {answer.selectedOption || 'No answer selected'}
                        </div>
                      </div>
                      
                      {!answer.isCorrect && (
                        <div>
                          <span className="font-medium text-sm text-gray-600">Correct Answer:</span>
                          <div className="p-2 rounded border bg-green-50 border-green-200">
                            {answer.correctOption}
                          </div>
                        </div>
                      )}
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
