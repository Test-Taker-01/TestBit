
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, BarChart, Trash2, Award, Users, TrendingUp, FileText, ChevronRight } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import StudentPerformanceList from './StudentPerformanceList';

interface TestResultsProps {
  testResults: any[];
  tests: any[];
  profiles: any[];
  onDeleteTest?: (testId: string) => void;
}

const TestResults: React.FC<TestResultsProps> = ({ testResults, tests, profiles = [], onDeleteTest }) => {
  const [selectedTestResults, setSelectedTestResults] = useState<any>(null);
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
    
    setSelectedTestResults(testResults_filtered);
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

  if (selectedTestResults && selectedTest) {
    return (
      <StudentPerformanceList
        test={selectedTest}
        results={selectedTestResults}
        profiles={profiles}
        onBack={() => {
          setSelectedTestResults(null);
          setSelectedTest(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 classic-accent-gradient rounded-xl modern-shadow">
            <BarChart size={24} className="text-amber-900" />
          </div>
          <h2 className="text-3xl font-bold text-foreground header-text">Test Results & Analytics</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/90 backdrop-blur-sm hover-lift border border-accent modern-shadow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-foreground proper-line-height">Total Submissions</CardTitle>
            <div className="p-2 classic-accent-gradient rounded-lg modern-shadow">
              <Eye className="h-4 w-4 text-amber-900" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary header-text">{testResults.length}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium proper-line-height">Test attempts</p>
          </CardContent>
        </Card>

        <Card className="bg-card/90 backdrop-blur-sm hover-lift border border-accent modern-shadow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-foreground proper-line-height">Average Score</CardTitle>
            <div className="p-2 classic-accent-gradient rounded-lg modern-shadow">
              <Award className="h-4 w-4 text-amber-900" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary header-text">{averageScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium proper-line-height">Class performance</p>
          </CardContent>
        </Card>

        <Card className="bg-card/90 backdrop-blur-sm hover-lift border border-accent modern-shadow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-foreground proper-line-height">Pass Rate</CardTitle>
            <div className="p-2 classic-accent-gradient rounded-lg modern-shadow">
              <TrendingUp className="h-4 w-4 text-amber-900" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary header-text">{passRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium proper-line-height">Students scoring ≥60%</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/90 backdrop-blur-sm hover-lift border border-accent modern-shadow">
        <CardHeader>
          <CardTitle className="text-xl text-foreground flex items-center gap-3">
            <div className="p-2 classic-accent-gradient rounded-lg modern-shadow">
              <FileText size={18} className="text-amber-900" />
            </div>
            <span className="header-text">Test Results</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground proper-line-height">Click on any test to view student performance</CardDescription>
        </CardHeader>
        <CardContent>
          {resultsByTest.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 classic-accent-gradient rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center modern-shadow">
                <BarChart size={24} className="text-amber-900" />
              </div>
              <p className="text-foreground text-lg font-medium proper-line-height">No test submissions yet.</p>
              <p className="text-muted-foreground text-sm mt-2 proper-line-height">Students will appear here after completing tests.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {resultsByTest.map((testGroup) => (
                <Card 
                  key={testGroup.test.id} 
                  className="bg-card/95 backdrop-blur-sm border border-accent hover:border-primary hover-lift transition-all duration-300 cursor-pointer group modern-shadow"
                  onClick={() => handleViewTestDetails(testGroup.test.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 classic-accent-gradient rounded-lg group-hover:scale-110 transition-transform duration-300 modern-shadow">
                          <FileText size={20} className="text-amber-900" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors header-text">
                            {testGroup.test.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-1">
                            {testGroup.test.subject && (
                              <span className="px-3 py-1 classic-accent-gradient text-amber-900 rounded-full text-xs font-semibold modern-shadow proper-line-height">
                                {testGroup.test.subject}
                              </span>
                            )}
                            <span className="text-sm text-muted-foreground proper-line-height">{testGroup.test.questions.length} questions</span>
                            <span className="text-sm text-muted-foreground proper-line-height">{testGroup.submissionCount} submissions</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-sm font-medium text-muted-foreground proper-line-height">Average Score</div>
                              <Badge variant={getScoreBadgeVariant(testGroup.averageScore)} className="font-bold proper-line-height">
                                {testGroup.averageScore.toFixed(1)}%
                              </Badge>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-muted-foreground proper-line-height">Pass Rate</div>
                              <div className="text-lg font-bold text-primary header-text">{testGroup.passRate.toFixed(1)}%</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              exportTestToExcel(testGroup.test.id);
                            }}
                            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground modern-shadow hover-lift proper-line-height"
                            size="sm"
                          >
                            <Download size={14} />
                            Export
                          </Button>
                          <ChevronRight className="h-5 w-5 text-primary group-hover:text-primary/80 group-hover:translate-x-1 transition-all" />
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
        <Card className="bg-card/90 backdrop-blur-sm hover-lift border border-accent modern-shadow">
          <CardHeader>
            <CardTitle className="text-xl text-destructive flex items-center gap-3">
              <div className="p-2 bg-destructive rounded-lg modern-shadow">
                <Trash2 size={18} className="text-destructive-foreground" />
              </div>
              <span className="header-text">Manage Tests</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground proper-line-height">Delete tests and their associated results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tests.map((test) => {
                const testResultsCount = testResults.filter(result => result.test_id === test.id).length;
                return (
                  <div key={test.id} className="flex items-center justify-between p-4 border border-accent rounded-lg bg-card/50 backdrop-blur-sm">
                    <div>
                      <h4 className="font-medium text-foreground proper-line-height">{test.title}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-muted-foreground proper-line-height">
                          {test.questions.length} questions
                        </p>
                        <p className="text-sm text-muted-foreground proper-line-height">
                          {testResultsCount} submissions
                        </p>
                        {test.subject && (
                          <span className="px-3 py-1 classic-accent-gradient text-amber-900 rounded-full text-xs font-semibold modern-shadow proper-line-height">
                            {test.subject}
                          </span>
                        )}
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="flex items-center gap-2 bg-destructive hover:bg-destructive/90 modern-shadow hover-lift proper-line-height">
                          <Trash2 size={16} />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border border-accent">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-destructive header-text">Delete Test</AlertDialogTitle>
                          <AlertDialogDescription className="text-muted-foreground proper-line-height">
                            Are you sure you want to delete "<span className="font-medium">{test.title}</span>"? This will also delete all associated test results. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-accent bg-card/80 backdrop-blur-sm proper-line-height">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => onDeleteTest(test.id)}
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground proper-line-height"
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
