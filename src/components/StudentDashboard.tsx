
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Clock, CheckCircle, BookOpen, LogOut, Award, Search, Filter } from 'lucide-react';
import FullScreenTestInterface from './FullScreenTestInterface';

interface StudentDashboardProps {
  onLogout: () => void;
  tests: any[];
  onSubmitTest: (testId: string, answers: any[]) => void;
  studentResults: any[];
  resources: any[];
  studentId: string;
  studentName?: string;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onLogout,
  tests,
  onSubmitTest,
  studentResults,
  resources,
  studentId,
  studentName
}) => {
  const [activeTab, setActiveTab] = useState('tests');
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const completedTestIds = studentResults.map(result => result.test_id);
  
  // Get unique subjects from tests
  const subjects = Array.from(new Set(tests.map(test => test.subject).filter(Boolean)));

  // Filter tests based on search and filters
  const filteredTests = tests.filter(test => {
    // Only show tests that haven't been completed
    if (completedTestIds.includes(test.id)) return false;
    
    // Search filter
    if (searchTerm && !test.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Subject filter
    if (subjectFilter !== 'all' && test.subject !== subjectFilter) {
      return false;
    }
    
    // Date filter
    if (dateFilter !== 'all') {
      const testDate = new Date(test.created_at);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - testDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'today':
          if (daysDiff !== 0) return false;
          break;
        case 'week':
          if (daysDiff > 7) return false;
          break;
        case 'month':
          if (daysDiff > 30) return false;
          break;
      }
    }
    
    return true;
  });

  const averageScore = studentResults.length > 0 
    ? studentResults.reduce((acc, result) => acc + result.score, 0) / studentResults.length 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
            {studentName && (
              <p className="text-sm text-gray-600">Welcome, {studentName}</p>
            )}
          </div>
          <Button onClick={onLogout} variant="outline" className="flex items-center gap-2">
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </header>

      <div className="p-6">
        {selectedTest ? (
          <FullScreenTestInterface
            test={selectedTest}
            studentName={studentName}
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
                    <div className="text-2xl font-bold">{filteredTests.length}</div>
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

              {/* Filter and Search Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter size={20} />
                    Filter Tests
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Search by name</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search tests..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Filter by subject</label>
                      <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All subjects" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All subjects</SelectItem>
                          {subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Filter by date</label>
                      <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All dates" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All dates</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="week">This week</SelectItem>
                          <SelectItem value="month">This month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {(searchTerm || subjectFilter !== 'all' || dateFilter !== 'all') && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('');
                        setSubjectFilter('all');
                        setDateFilter('all');
                      }}
                      className="text-sm"
                    >
                      Clear filters
                    </Button>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Available Tests</h2>
                {filteredTests.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">
                        {completedTestIds.length > 0 
                          ? searchTerm || subjectFilter !== 'all' || dateFilter !== 'all'
                            ? "No tests match your current filters."
                            : "You have completed all available tests. Great job!"
                          : "No tests available at the moment."
                        }
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {filteredTests.map((test) => (
                      <Card key={test.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle>{test.title}</CardTitle>
                          <CardDescription>
                            {test.questions.length} questions • Duration: {test.duration} minutes
                            {test.subject && ` • Subject: ${test.subject}`}
                            <br />
                            Created: {new Date(test.created_at).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Status: <span className="font-medium text-green-600">Available</span>
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
                    const test = tests.find(t => t.id === result.test_id);
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
                            Completed on {new Date(result.completed_at).toLocaleDateString()}
                            {test?.subject && ` • Subject: ${test.subject}`}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Questions: {result.total_questions}</span>
                            <span>Correct: {result.correct_answers}</span>
                            <span>Time: {result.time_taken || 'N/A'}</span>
                          </div>
                          <div className="mt-2 text-sm text-red-600 font-medium">
                            ✓ Test completed - Cannot retake
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
