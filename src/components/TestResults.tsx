
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, BarChart, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import DetailedTestResult from './DetailedTestResult';

interface TestResultsProps {
  testResults: any[];
  tests: any[];
  profiles: any[];
  onDeleteTest?: (testId: string) => void;
}

const TestResults: React.FC<TestResultsProps> = ({ testResults, tests, profiles = [], onDeleteTest }) => {
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [selectedTest, setSelectedTest] = useState<any>(null);

  const exportToExcel = () => {
    const csvContent = [
      ['Student Name', 'Student ID', 'Test Title', 'Score', 'Total Questions', 'Correct Answers', 'Completion Date'].join(','),
      ...testResults.map(result => {
        const test = tests.find(t => t.id === result.test_id);
        const profile = profiles.find(p => p.user_id === result.student_id);
        return [
          profile?.name || 'Unknown Student',
          profile?.student_id || result.student_id,
          test?.title || 'Unknown Test',
          `${result.score}%`,
          result.total_questions,
          result.correct_answers,
          new Date(result.completed_at).toLocaleDateString()
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test-results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const averageScore = testResults.length > 0 
    ? testResults.reduce((acc, result) => acc + result.score, 0) / testResults.length 
    : 0;
  
  const passRate = testResults.length > 0 
    ? (testResults.filter(result => result.score >= 60).length / testResults.length) * 100 
    : 0;

  const handleViewDetails = (result: any) => {
    const test = tests.find(t => t.id === result.test_id);
    setSelectedResult(result);
    setSelectedTest(test);
  };

  const getStudentName = (studentId: string) => {
    const profile = profiles.find(p => p.user_id === studentId);
    return profile?.name || 'Unknown Student';
  };

  if (selectedResult && selectedTest) {
    return (
      <DetailedTestResult
        result={selectedResult}
        test={selectedTest}
        studentName={getStudentName(selectedResult.student_id)}
        onBack={() => {
          setSelectedResult(null);
          setSelectedTest(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Test Results & Analytics</h2>
        <Button onClick={exportToExcel} className="flex items-center gap-2">
          <Download size={16} />
          Export to Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testResults.length}</div>
            <p className="text-xs text-muted-foreground">Test attempts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Class performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Students scoring ≥60%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Results</CardTitle>
          <CardDescription>Individual student performance across all tests</CardDescription>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No test submissions yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Test</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Correct</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testResults.map((result, index) => {
                  const test = tests.find(t => t.id === result.test_id);
                  const studentName = getStudentName(result.student_id);
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{studentName}</TableCell>
                      <TableCell>{test?.title || 'Unknown Test'}</TableCell>
                      <TableCell>
                        <Badge variant={getScoreBadgeVariant(result.score)}>
                          {result.score}%
                        </Badge>
                      </TableCell>
                      <TableCell>{result.total_questions}</TableCell>
                      <TableCell>{result.correct_answers}</TableCell>
                      <TableCell>{new Date(result.completed_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(result)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {onDeleteTest && (
        <Card>
          <CardHeader>
            <CardTitle>Manage Tests</CardTitle>
            <CardDescription>Delete tests and their associated results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tests.map((test) => {
                const testResultsCount = testResults.filter(result => result.testId === test.id).length;
                return (
                  <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{test.title}</h4>
                      <p className="text-sm text-gray-600">
                        {test.questions.length} questions • {testResultsCount} submissions
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="flex items-center gap-2">
                          <Trash2 size={16} />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Test</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{test.title}"? This will also delete all associated test results. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => onDeleteTest(test.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete Test
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestResults;
