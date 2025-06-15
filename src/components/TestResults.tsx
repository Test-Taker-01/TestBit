
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, BarChart, Trash2, Award, Users, TrendingUp, FileText, ChevronRight } from 'lucide-react';
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

  const handleViewTestDetails = (testId: string) => {
    const test = tests.find(t => t.id === testId);
    const testResults_filtered = testResults.filter(result => result.test_id === testId);
    
    // For now, we'll show the first result's detailed view
    // In a real implementation, you might want to show a list of all results for this test
    if (testResults_filtered.length > 0) {
      setSelectedResult(testResults_filtered[0]);
      setSelectedTest(test);
    }
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
            Test Results
          </CardTitle>
          <CardDescription className="text-gray-600">Click on any test to view detailed results</CardDescription>
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
            <div className="grid gap-4">
              {resultsByTest.map((testGroup) => (
                <Card 
                  key={testGroup.test.id} 
                  className="bg-gradient-to-r from-white to-gray-50/80 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => handleViewTestDetails(testGroup.test.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                          <FileText size={20} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                            {testGroup.test.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-1">
                            {testGroup.test.subject && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {testGroup.test.subject}
                              </span>
                            )}
                            <span className="text-sm text-gray-600">{testGroup.test.questions.length} questions</span>
                            <span className="text-sm text-gray-600">{testGroup.submissionCount} submissions</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-sm font-medium text-gray-600">Average Score</div>
                              <Badge variant={getScoreBadgeVariant(testGroup.averageScore)} className="font-bold">
                                {testGroup.averageScore.toFixed(1)}%
                              </Badge>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-gray-600">Pass Rate</div>
                              <div className="text-lg font-bold text-green-600">{testGroup.passRate.toFixed(1)}%</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              exportTestToExcel(testGroup.test.id);
                            }}
                            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 modern-shadow hover-lift"
                            size="sm"
                          >
                            <Download size={14} />
                            Export
                          </Button>
                          <ChevronRight className="h-5 w-5 text-purple-500 group-hover:text-purple-700 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
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
