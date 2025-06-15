
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, ArrowLeft, ArrowRight, Flag, Maximize, AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface FullScreenTestInterfaceProps {
  test: any;
  onSubmit: (answers: any[]) => void;
  onBack: () => void;
  studentName?: string;
}

const FullScreenTestInterface: React.FC<FullScreenTestInterfaceProps> = ({ test, onSubmit, onBack, studentName }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(test.questions.length).fill(-1));
  const [timeLeft, setTimeLeft] = useState(test.duration * 60);
  const [flagged, setFlagged] = useState<boolean[]>(new Array(test.questions.length).fill(false));
  const [markedForReview, setMarkedForReview] = useState<boolean[]>(new Array(test.questions.length).fill(false));
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [exitAttempts, setExitAttempts] = useState(0);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  useEffect(() => {
    // Force light mode by adding light class to body
    document.body.classList.add('light');
    document.body.classList.remove('dark');
    
    // Enter fullscreen when component mounts
    enterFullScreen();

    // Handle fullscreen change events
    const handleFullScreenChange = () => {
      const isCurrentlyFullScreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      
      setIsFullScreen(isCurrentlyFullScreen);
      
      if (!isCurrentlyFullScreen) {
        handleExitAttempt();
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', handleFullScreenChange);

    // Handle page visibility change (when user switches tabs)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleExitAttempt();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Handle beforeunload (when user tries to close/refresh)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      handleExitAttempt();
      return (e.returnValue = 'Are you sure you want to exit the test?');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Restore original theme when component unmounts
      document.body.classList.remove('light');
      
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      exitFullScreen();
    };
  }, []);

  const enterFullScreen = () => {
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen();
      } else if ((containerRef.current as any).mozRequestFullScreen) {
        (containerRef.current as any).mozRequestFullScreen();
      } else if ((containerRef.current as any).msRequestFullscreen) {
        (containerRef.current as any).msRequestFullscreen();
      }
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  };

  const handleExitAttempt = () => {
    const newAttempts = exitAttempts + 1;
    setExitAttempts(newAttempts);

    if (newAttempts === 1) {
      setShowExitWarning(true);
    } else if (newAttempts >= 2) {
      // Auto-submit after second attempt
      handleSubmit();
    }
  };

  const handleWarningContinue = () => {
    setShowExitWarning(false);
    enterFullScreen();
  };

  const handleWarningExit = () => {
    setShowExitWarning(false);
    exitFullScreen();
    onBack();
  };

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
      isCorrect: answer === test.questions[index].correctAnswer,
      question: test.questions[index].question,
      selectedOption: answer !== -1 ? test.questions[index].options[answer] : null,
      correctOption: test.questions[index].options[test.questions[index].correctAnswer]
    }));
    exitFullScreen();
    onSubmit(results);
  };

  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;
  const answeredCount = answers.filter(a => a !== -1).length;

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-gray-900 p-4">
      <AlertDialog open={showExitWarning} onOpenChange={setShowExitWarning}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-yellow-500" size={20} />
              Exit Test Warning
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are attempting to exit the test. If you exit again, your test will be automatically submitted with current answers. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleWarningContinue}>Continue Test</AlertDialogCancel>
            <AlertDialogAction onClick={handleWarningExit} className="bg-red-600 hover:bg-red-700">
              Exit Test
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => {
                exitFullScreen();
                onBack();
              }} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Exit Test
            </Button>
            <div className="text-yellow-600 text-sm">
              {exitAttempts > 0 && `Exit attempts: ${exitAttempts}/2`}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-red-600">
              <Clock size={16} />
              <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
            </div>
            <Button onClick={handleSubmit} variant="destructive">
              Submit Test
            </Button>
          </div>
        </div>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-gray-900">{test.title}</CardTitle>
                {studentName && (
                  <p className="text-sm text-gray-600 mt-1">Student: {studentName}</p>
                )}
              </div>
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {test.questions.length}
              </span>
            </div>
            <Progress value={progress} className="w-full" />
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-gray-900">
                    Q{currentQuestionIndex + 1}. {currentQuestion.question}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleFlag}
                      className={flagged[currentQuestionIndex] ? 'text-red-600' : 'text-gray-500'}
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
              <CardContent className="space-y-4">
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
                          ? 'border-blue-500 bg-blue-50 text-gray-900'
                          : 'border-gray-300 hover:border-gray-400 bg-white text-gray-700'
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            answers[currentQuestionIndex] === index
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-400'
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
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-700">
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

            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Question Navigator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
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
                <div className="mt-4 space-y-2 text-xs text-gray-700">
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
    </div>
  );
};

export default FullScreenTestInterface;
