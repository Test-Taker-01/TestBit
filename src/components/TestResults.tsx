
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, BarChart } from 'lucide-react';

interface TestResultsProps {
  testResults: any[];
  tests: any[];
}

const TestResults: React.FC<TestResultsProps> = ({ testResults, tests }) => {
  const exportToExcel = () => {
    const csvContent = [
      ['Student ID', 'Test Title', 'Score', 'Total Questions', 'Correct Answers', 'Completion Date'].join(','),
      ...testResults.map(result => {
        const test = tests.find(t => t.id === result.testId);
        return [
          result.studentId,
          test?.title || 'Unknown Test',
          `${result.score}%`,
          result.totalQuestions,
          result.correctAnswers,
          new Date(result.completedAt).toLocaleDateString()
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
                  <TableHead>Student ID</TableHead>
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
                  const test = tests.find(t => t.id === result.testId);
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{result.studentId}</TableCell>
                      <TableCell>{test?.title || 'Unknown Test'}</TableCell>
                      <TableCell>
                        <Badge variant={getScoreBadgeVariant(result.score)}>
                          {result.score}%
                        </Badge>
                      </TableCell>
                      <TableCell>{result.totalQuestions}</TableCell>
                      <TableCell>{result.correctAnswers}</TableCell>
                      <TableCell>{new Date(result.completedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
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
    </div>
  );
};

export default TestResults;
