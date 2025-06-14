
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Trash2, Image, Save, X } from 'lucide-react';

interface TestCreatorProps {
  onClose: () => void;
  onCreateTest: (test: any) => void;
}

interface Question {
  id: string;
  question: string;
  image?: string;
  options: string[];
  correctAnswer: number;
}

const TestCreator: React.FC<TestCreatorProps> = ({ onClose, onCreateTest }) => {
  const [testTitle, setTestTitle] = useState('');
  const [testSubject, setTestSubject] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  const addQuestion = () => {
    if (currentQuestion.question && currentQuestion.options.every(opt => opt.trim())) {
      const newQuestion = {
        ...currentQuestion,
        id: Date.now().toString()
      };
      setQuestions([...questions, newQuestion]);
      setCurrentQuestion({
        id: '',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      });
    }
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const updateCurrentQuestion = (field: string, value: any) => {
    setCurrentQuestion({ ...currentQuestion, [field]: value });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentQuestion({ ...currentQuestion, image: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const createTest = () => {
    if (testTitle && questions.length > 0) {
      const newTest = {
        id: Date.now().toString(),
        title: testTitle,
        subject: testSubject,
        questions: questions,
        createdAt: new Date().toISOString(),
        isPublished: true
      };
      onCreateTest(newTest);
      onClose();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Create New Test
            <Button onClick={onClose} variant="ghost" size="sm">
              <X size={16} />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Test Title</label>
              <Input
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder="Enter test title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={testSubject}
                onChange={(e) => setTestSubject(e.target.value)}
                placeholder="Enter subject"
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Add Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Question</label>
                <Textarea
                  value={currentQuestion.question}
                  onChange={(e) => updateCurrentQuestion('question', e.target.value)}
                  placeholder="Enter your question"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Add Image (Optional)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="flex items-center gap-2"
                  >
                    <Image size={16} />
                    Upload Image
                  </Button>
                  {currentQuestion.image && (
                    <img
                      src={currentQuestion.image}
                      alt="Question"
                      className="w-20 h-20 object-cover rounded border"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <div key={index}>
                    <label className="text-sm font-medium">Option {index + 1}</label>
                    <div className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Enter option ${index + 1}`}
                      />
                      <Button
                        variant={currentQuestion.correctAnswer === index ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateCurrentQuestion('correctAnswer', index)}
                      >
                        ✓
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={addQuestion} className="flex items-center gap-2">
                <Plus size={16} />
                Add Question
              </Button>
            </CardContent>
          </Card>

          {questions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Questions ({questions.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">Q{index + 1}: {question.question}</h4>
                        {question.image && (
                          <img
                            src={question.image}
                            alt="Question"
                            className="w-32 h-24 object-cover rounded mt-2"
                          />
                        )}
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-2 rounded ${
                                question.correctAnswer === optIndex
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100'
                              }`}
                            >
                              {optIndex + 1}. {option}
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={createTest}
              disabled={!testTitle || questions.length === 0}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              Create Test
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestCreator;
