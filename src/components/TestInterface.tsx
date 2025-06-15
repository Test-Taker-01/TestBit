import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, ArrowLeft, ArrowRight, Flag, Maximize } from 'lucide-react';

interface TestInterfaceProps {
  test: any;
  onSubmit: (answers: any[]) => void;
  onBack: () => void;
}

const TestInterface: React.FC<TestInterfaceProps> = ({ test, onSubmit, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(test.questions.length).fill(-1));
  const [timeLeft, setTimeLeft] = useState(test.duration * 60);
  const [flagged, setFlagged] = useState<boolean[]>(new Array(test.questions.length).fill(false));
  const [markedForReview, setMarkedForReview] = useState<boolean[]>(new Array(test.questions.length).fill(false));

  useEffect(() => {
    // Reset timer when test changes
    setTimeLeft(test.duration * 60);
  }, [test.duration]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const toggleFlag = () => {
    const newFlagged = [...flagged];
    newFlagged[currentQuestionIndex] = !newFlagged[currentQuestionIndex];
    setFlagged(newFlagged);
  };

  const toggleMarkForReview = () => {
    const newMarkedForReview = [...markedForReview];
    newMarkedForReview[currentQuestionIndex] = !newMarkedForReview[currentQuestionIndex];
    setMarkedForReview(newMarkedForReview);
  };

  const handleSubmit = () => {
    const results = answers.map((answer, index) => ({
      questionId: test.questions[index].id,
      selectedAnswer: answer,
      isCorrect: answer === test.questions[index].correctAnswer
    }));
    onSubmit(results);
  };

  const enterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;
  const answeredCount = answers.filter(a => a !== -1).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>
        <div className="flex items-center gap-4">
          <Button onClick={enterFullscreen} variant="outline" className="flex items-center gap-2">
            <Maximize size={16} />
            Fullscreen
          </Button>
          <div className="flex items-center gap-2 text-red-600">
            <Clock size={16} />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
          <Button onClick={handleSubmit} variant="destructive">
            Submit Test
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{test.title}</CardTitle>
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {test.questions.length}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  Q{currentQuestionIndex + 1}. {currentQuestion.question}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFlag}
                    className={flagged[currentQuestionIndex] ? 'text-red-600' : 'text-gray-400'}
                  >
                    <Flag size={16} />
                  </Button>
                  <Button
                    variant={markedForReview[currentQuestionIndex] ? "default" : "outline"}
                    size="sm"
                    onClick={toggleMarkForReview}
                  >
                    Mark for Review
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] w-full">
                <div className="space-y-4 pr-4">
                  {currentQuestion.image && (
                    <div className="flex justify-center">
                      <img
                        src={currentQuestion.image}
                        alt="Question"
                        className="max-w-full max-h-64 object-contain rounded border"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    {currentQuestion.options.map((option: string, index: number) => (
                      <button
                        key={index}
                        className={`w-full p-4 text-left border rounded-lg transition-colors ${
                          answers[currentQuestionIndex] === index
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleAnswerSelect(index)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              answers[currentQuestionIndex] === index
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            }`}
                          >
                            {answers[currentQuestionIndex] === index && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="font-medium text-gray-700">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </ScrollArea>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentQuestionIndex(Math.min(test.questions.length - 1, currentQuestionIndex + 1))}
                  disabled={currentQuestionIndex === test.questions.length - 1}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Answered:</span>
                  <span>{answeredCount}/{test.questions.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Flagged:</span>
                  <span>{flagged.filter(Boolean).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Marked for Review:</span>
                  <span>{markedForReview.filter(Boolean).length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Question Navigator</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full">
                <div className="grid grid-cols-5 gap-2 pr-4">
                  {test.questions.map((_: any, index: number) => {
                    let buttonClass = '';
                    if (index === currentQuestionIndex) {
                      buttonClass = 'bg-blue-600 text-white border-blue-600';
                    } else if (answers[index] !== -1) {
                      buttonClass = 'bg-green-500 text-white border-green-500';
                    } else if (markedForReview[index]) {
                      buttonClass = 'bg-yellow-500 text-white border-yellow-500';
                    } else if (flagged[index]) {
                      buttonClass = 'bg-red-500 text-white border-red-500';
                    } else {
                      buttonClass = 'bg-gray-400 text-white border-gray-400';
                    }

                    return (
                      <button
                        key={index}
                        className={`w-10 h-10 rounded text-sm font-medium transition-colors border-2 ${buttonClass}`}
                        onClick={() => setCurrentQuestionIndex(index)}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded"></div>
                  <span>Not answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>Marked for review</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Flagged</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded"></div>
                  <span>Current question</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestInterface;
