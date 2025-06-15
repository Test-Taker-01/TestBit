import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Image, Save, X, Clock } from 'lucide-react';

interface TestCreatorProps {
  onClose: () => void;
  onCreateTest: (test: any) => void;
  initialTest?: any;
}

interface Question {
  id: string;
  question: string;
  image?: string;
  imageFormat?: string;
  options: string[];
  correctAnswer: number;
}

const TestCreator: React.FC<TestCreatorProps> = ({ onClose, onCreateTest, initialTest }) => {
  const [testTitle, setTestTitle] = useState('');
  const [testSubject, setTestSubject] = useState('');
  const [testDuration, setTestDuration] = useState('30'); // in minutes
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    imageFormat: 'jpeg'
  });

  // Load initial test data when editing
  useEffect(() => {
    if (initialTest) {
      setTestTitle(initialTest.title || '');
      setTestSubject(initialTest.subject || '');
      setTestDuration(initialTest.duration?.toString() || '30');
      setQuestions(initialTest.questions || []);
    }
  }, [initialTest]);

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
        correctAnswer: 0,
        imageFormat: 'jpeg'
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
      // Check if file format matches selected format
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const selectedFormat = currentQuestion.imageFormat || 'jpeg';
      
      if (fileExtension && !fileExtension.includes(selectedFormat.replace('jpeg', 'jpg'))) {
        alert(`Please select a ${selectedFormat.toUpperCase()} image file.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentQuestion({ ...currentQuestion, image: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const createTest = () => {
    if (testTitle && questions.length > 0 && testDuration) {
      const newTest = {
        id: initialTest?.id || Date.now().toString(),
        title: testTitle,
        subject: testSubject,
        duration: parseInt(testDuration),
        questions: questions,
        createdAt: initialTest?.createdAt || new Date().toISOString(),
        isPublished: true
      };
      console.log('Creating/updating test:', newTest);
      onCreateTest(newTest);
      onClose();
    } else {
      alert('Please fill in all required fields and add at least one question.');
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialTest ? 'Edit Test' : 'Create New Test'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Test Title *</label>
              <Input
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder="Enter test title"
                required
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
            <div>
              <label className="text-sm font-medium">Duration (minutes) *</label>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-500" />
                <Input
                  type="number"
                  value={testDuration}
                  onChange={(e) => setTestDuration(e.target.value)}
                  placeholder="30"
                  min="1"
                  max="300"
                  required
                />
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Add Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Question *</label>
                <Textarea
                  value={currentQuestion.question}
                  onChange={(e) => updateCurrentQuestion('question', e.target.value)}
                  placeholder="Enter your question"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Image Format (Optional)</label>
                  <Select
                    value={currentQuestion.imageFormat}
                    onValueChange={(value) => updateCurrentQuestion('imageFormat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select image format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="jpg">JPG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="gif">GIF</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                      <SelectItem value="svg">SVG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Add Image (Optional)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept={`image/${currentQuestion.imageFormat || '*'}`}
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="flex items-center gap-2"
                    >
                      <Image size={16} />
                      Upload {currentQuestion.imageFormat?.toUpperCase()} Image
                    </Button>
                  </div>
                </div>
              </div>

              {currentQuestion.image && (
                <div className="flex items-center gap-4">
                  <img
                    src={currentQuestion.image}
                    alt="Question"
                    className="w-32 h-24 object-cover rounded border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateCurrentQuestion('image', undefined)}
                  >
                    Remove Image
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <div key={index}>
                    <label className="text-sm font-medium">Option {index + 1} *</label>
                    <div className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Enter option ${index + 1}`}
                        required
                      />
                      <Button
                        type="button"
                        variant={currentQuestion.correctAnswer === index ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateCurrentQuestion('correctAnswer', index)}
                        title="Mark as correct answer"
                      >
                        ✓
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                type="button"
                onClick={addQuestion} 
                className="flex items-center gap-2"
                disabled={!currentQuestion.question || !currentQuestion.options.every(opt => opt.trim())}
              >
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
                          <div className="mt-2">
                            <img
                              src={question.image}
                              alt="Question"
                              className="w-32 h-24 object-cover rounded"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Format: {question.imageFormat?.toUpperCase()}
                            </p>
                          </div>
                        )}
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-2 rounded ${
                                question.correctAnswer === optIndex
                                  ? 'bg-green-100 text-green-800 font-medium'
                                  : 'bg-gray-100'
                              }`}
                            >
                              {optIndex + 1}. {option}
                              {question.correctAnswer === optIndex && ' ✓'}
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button
                        type="button"
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

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Duration: {testDuration} minutes • Questions: {questions.length}
            </div>
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={createTest}
                disabled={!testTitle || questions.length === 0 || !testDuration}
                className="flex items-center gap-2"
              >
                <Save size={16} />
                {initialTest ? 'Update Test' : 'Create Test'} ({questions.length} questions)
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestCreator;
