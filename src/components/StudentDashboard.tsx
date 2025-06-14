
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Clock, CheckCircle, BookOpen, LogOut, Award } from 'lucide-react';
import TestInterface from './TestInterface';

interface StudentDashboardProps {
  onLogout: () => void;
  tests: any[];
  onSubmitTest: (testId: string, answers: any[]) => void;
  studentResults: any[];
  resources: any[];
  studentId: string;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onLogout,
  tests,
  onSubmitTest,
  studentResults,
  resources,
  studentId
}) => {
  const [activeTab, setActiveTab] = useState('tests');
  const [selectedTest, setSelectedTest] = useState<any>(null);

  const completedTestIds = studentResults.map(result => result.testId);
  const availableTests = tests.filter(test => !completedTestIds.includes(test.id));
  const averageScore = studentResults.length > 0 
    ? studentResults.reduce((acc, result) => acc + result.score, 0) / studentResults.length 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
          <Button onClick={onLogout} variant="outline" className="flex items-center gap-2">
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </header>

      <div className="p-6">
        {selectedTest ? (
          <TestInterface
            test={selectedTest}
            onSubmit={(answers) => {
              onSubmitTest(selectedTest.id, answers);
              setSelectedTest(null);
            }}
            onBack={() => setSelectedTest(null)}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tests">Available Tests</TabsTrigger>
              <TabsTrigger value="results">My Results</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="tests" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Available Tests</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{availableTests.length}</div>
                    <p className="text-xs text-muted-foreground">Ready to attempt</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{studentResults.length}</div>
                    <p className="text-xs text-muted-foreground">Tests completed</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">Your performance</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Available Tests</h2>
                {availableTests.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">No tests available at the moment.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {availableTests.map((test) => (
                      <Card key={test.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle>{test.title}</CardTitle>
                          <CardDescription>
                            {test.questions.length} questions • Duration: 30 minutes
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Subject: <span className="font-medium">{test.subject || 'General'}</span>
                            </span>
                            <Button 
                              onClick={() => setSelectedTest(test)}
                              className="flex items-center gap-2"
                            >
                              <Play size={16} />
                              Start Test
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              <h2 className="text-xl font-semibold">My Test Results</h2>
              {studentResults.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">No test results yet. Take your first test!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {studentResults.map((result, index) => {
                    const test = tests.find(t => t.id === result.testId);
                    return (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>{test?.title || 'Unknown Test'}</span>
                            <span className={`text-lg font-bold ${
                              result.score >= 80 ? 'text-green-600' : 
                              result.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {result.score}%
                            </span>
                          </CardTitle>
                          <CardDescription>
                            Completed on {new Date(result.completedAt).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Questions: {result.totalQuestions}</span>
                            <span>Correct: {result.correctAnswers}</span>
                            <span>Time: {result.timeTaken || 'N/A'}</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <h2 className="text-xl font-semibold">Study Resources</h2>
              {resources.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">No resources available yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {resources.map((resource) => (
                    <Card key={resource.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen size={20} />
                          {resource.title}
                        </CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Type: {resource.type} • Added: {new Date(resource.createdAt).toLocaleDateString()}
                          </span>
                          <Button variant="outline" size="sm">
                            View Resource
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
