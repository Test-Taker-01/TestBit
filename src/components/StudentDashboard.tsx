import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, BarChart, Clock, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FullScreenTestInterface from './FullScreenTestInterface';
import ResultsFilter, { FilterState } from './ResultsFilter';

interface StudentDashboardProps {
  onLogout: () => void;
  tests: any[];
  onSubmitTest: (testId: string, answers: any[]) => void;
  studentResults: any[];
  resources: any[];
  studentId: string;
  studentName: string;
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
  const [filteredResults, setFilteredResults] = useState(studentResults);
  const navigate = useNavigate();

  const averageScore = studentResults.length > 0 
    ? studentResults.reduce((acc, result) => acc + result.score, 0) / studentResults.length 
    : 0;

  const completedTests = studentResults.length;
  const availableTests = tests.length;

  React.useEffect(() => {
    setFilteredResults(studentResults);
  }, [studentResults]);

  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...studentResults];

    // Filter by test
    if (filters.testId) {
      filtered = filtered.filter(result => result.test_id === filters.testId);
    }

    // Filter by score range
    if (filters.minScore) {
      filtered = filtered.filter(result => result.score >= parseInt(filters.minScore));
    }
    if (filters.maxScore) {
      filtered = filtered.filter(result => result.score <= parseInt(filters.maxScore));
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(result => 
        new Date(result.completed_at) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(result => 
        new Date(result.completed_at) <= new Date(filters.dateTo + 'T23:59:59')
      );
    }

    setFilteredResults(filtered);
  };

  if (selectedTest) {
    return (
      <FullScreenTestInterface
        test={selectedTest}
        onSubmit={(answers) => {
          onSubmitTest(selectedTest.id, answers);
          setSelectedTest(null);
        }}
        onBack={() => setSelectedTest(null)}
        studentName={studentName}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600">Welcome back, {studentName}!</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => navigate('/profile')} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <User size={16} />
              Profile
            </Button>
            <Button onClick={onLogout} variant="outline" className="flex items-center gap-2">
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tests">Available Tests</TabsTrigger>
            <TabsTrigger value="results">My Results</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="tests" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Tests</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{availableTests}</div>
                  <p className="text-xs text-muted-foreground">Ready to take</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedTests}</div>
                  <p className="text-xs text-muted-foreground">Tests completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">Your performance</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4">
              {tests.map((test) => {
                const hasCompleted = studentResults.some(result => result.test_id === test.id);
                return (
                  <Card key={test.id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        {test.title}
                        {hasCompleted && (
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                            Completed
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {test.questions.length} questions • Duration: {test.duration} minutes
                        {test.subject && ` • Subject: ${test.subject}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          <Clock size={16} className="inline mr-1" />
                          {test.duration} minutes
                        </div>
                        <Button 
                          onClick={() => setSelectedTest(test)}
                          disabled={hasCompleted}
                        >
                          {hasCompleted ? 'Already Completed' : 'Start Test'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="results">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">My Test Results</h2>
              
              <ResultsFilter 
                onFilterChange={handleFilterChange}
                tests={tests}
                showTestFilter={true}
              />

              {filteredResults.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {studentResults.length === 0 ? 'No test results yet.' : 'No results match your filters.'}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredResults.map((result) => {
                    const test = tests.find(t => t.id === result.test_id);
                    return (
                      <Card key={result.id}>
                        <CardHeader>
                          <CardTitle>{test?.title || 'Unknown Test'}</CardTitle>
                          <CardDescription>
                            Score: {result.score}% • Completed on {new Date(result.completed_at).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-gray-600">
                            Correct Answers: {result.correct_answers} / {result.total_questions}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="resources">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Resources</h2>
              {resources.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No resources available yet.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {resources.map((resource) => (
                    <Card key={resource.id}>
                      <CardHeader>
                        <CardTitle>{resource.title}</CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          View Resource
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
