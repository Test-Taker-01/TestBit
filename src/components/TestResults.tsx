
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, BarChart, Trash2, Award, Users, TrendingUp, FileText } from 'lucide-react';
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

  const exportTestToExcel = (testId: string) => {
    const test = tests.find(t => t.id === testId);
    const testResultsForTest = testResults.filter(result => result.test_id === testId);
    
    const csvContent = [
      ['Student Name', 'Student ID', 'Score', 'Total Questions', 'Correct Answers', 'Completion Date'].join(','),
      ...testResultsForTest.map(result => {
        const profile = profiles.find(p => p.user_id === result.student_id);
        return [
          profile?.name || 'Unknown Student',
          profile?.student_id || result.student_id,
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
    a.download = `${test?.title || 'test'}-results.csv`;
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

  // Group results by test
  const resultsByTest = tests.map(test => {
    const testResults_filtered = testResults.filter(result => result.test_id === test.id);
    const averageTestScore = testResults_filtered.length > 0 
      ? testResults_filtered.reduce((acc, result) => acc + result.score, 0) / testResults_filtered.length 
      : 0;
    const passRateTest = testResults_filtered.length > 0 
      ? (testResults_filtered.filter(result => result.score >= 60).length / testResults_filtered.length) * 100 
      : 0;

    return {
      test,
      results: testResults_filtered,
      averageScore: averageTestScore,
      passRate: passRateTest,
      submissionCount: testResults_filtered.length
    };
  }).filter(testGroup => testGroup.results.length > 0);

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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Test Results & Analytics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 modern-shadow hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Total Submissions</CardTitle>
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <Eye className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{testResults.length}</div>
            <p className="text-xs text-gray-600 mt-1">Test attempts</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 modern-shadow hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Average Score</CardTitle>
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Award className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{averageScore.toFixed(1)}%</div>
            <p className="text-xs text-gray-600 mt-1">Class performance</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 modern-shadow hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Pass Rate</CardTitle>
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{passRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-600 mt-1">Students scoring ≥60%</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-0 modern-shadow">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <FileText size={18} className="text-white" />
            </div>
            Results by Test
          </CardTitle>
          <CardDescription className="text-gray-600">Performance overview for each test</CardDescription>
        </CardHeader>
        <CardContent>
          {resultsByTest.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BarChart size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No test submissions yet.</p>
              <p className="text-gray-400 text-sm mt-2">Students will appear here after completing tests.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {resultsByTest.map((testGroup) => (
                <Card key={testGroup.test.id} className="bg-gray-50/50 border border-gray-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-gray-800 flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                            <FileText size={16} className="text-white" />
                          </div>
                          {testGroup.test.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2 ml-10">
                          {testGroup.test.subject && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {testGroup.test.subject}
                            </span>
                          )}
                          <span className="text-sm text-gray-600">{testGroup.test.questions.length} questions</span>
                          <span className="text-sm text-gray-600">{testGroup.submissionCount} submissions</span>
                        </CardDescription>
                      </div>
                      <Button 
                        onClick={() => exportTestToExcel(testGroup.test.id)}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 modern-shadow hover-lift"
                        size="sm"
                      >
                        <Download size={14} />
                        Export
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 ml-10">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium">Avg Score: {testGroup.averageScore.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Pass Rate: {testGroup.passRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Submissions: {testGroup.submissionCount}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50/50">
                            <TableHead className="font-semibold">Student Name</TableHead>
                            <TableHead className="font-semibold">Score</TableHead>
                            <TableHead className="font-semibold">Correct</TableHead>
                            <TableHead className="font-semibold">Date</TableHead>
                            <TableHead className="font-semibold">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {testGroup.results.map((result, index) => {
                            const studentName = getStudentName(result.student_id);
                            return (
                              <TableRow key={index} className="hover:bg-purple-50/30 transition-colors">
                                <TableCell className="font-medium">{studentName}</TableCell>
                                <TableCell>
                                  <Badge variant={getScoreBadgeVariant(result.score)} className="font-medium">
                                    {result.score}%
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <span className="font-medium text-green-600">{result.correct_answers}/{result.total_questions}</span>
                                </TableCell>
                                <TableCell className="text-gray-600">{new Date(result.completed_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleViewDetails(result)}
                                    className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
                                  >
                                    View Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {onDeleteTest && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 modern-shadow">
          <CardHeader>
            <CardTitle className="text-xl text-red-600 flex items-center gap-3">
              <div className="p-2 bg-red-500 rounded-lg">
                <Trash2 size={18} className="text-white" />
              </div>
              Manage Tests
            </CardTitle>
            <CardDescription className="text-gray-600">Delete tests and their associated results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tests.map((test) => {
                const testResultsCount = testResults.filter(result => result.test_id === test.id).length;
                return (
                  <div key={test.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                    <div>
                      <h4 className="font-medium text-gray-900">{test.title}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-gray-600">
                          {test.questions.length} questions
                        </p>
                        <p className="text-sm text-gray-600">
                          {testResultsCount} submissions
                        </p>
                        {test.subject && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {test.subject}
                          </span>
                        )}
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="flex items-center gap-2 bg-red-500 hover:bg-red-600">
                          <Trash2 size={16} />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-red-600">Delete Test</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600">
                            Are you sure you want to delete "<span className="font-medium">{test.title}</span>"? This will also delete all associated test results. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-gray-300">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => onDeleteTest(test.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
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
