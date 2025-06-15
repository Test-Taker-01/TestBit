import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, BarChart, Trash2, Award, Users, TrendingUp } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import DetailedTestResult from './DetailedTestResult';
import ResultsFilter, { FilterState } from './ResultsFilter';

interface TestResultsProps {
  testResults: any[];
  tests: any[];
  profiles: any[];
  onDeleteTest?: (testId: string) => void;
}

const TestResults: React.FC<TestResultsProps> = ({ testResults, tests, profiles = [], onDeleteTest }) => {
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [filteredResults, setFilteredResults] = useState(testResults);

  React.useEffect(() => {
    console.log('TestResults - testResults changed:', testResults.length);
    setFilteredResults(testResults);
  }, [testResults]);

  const handleFilterChange = (filters: FilterState) => {
    console.log('TestResults - Applying filters:', filters);
    let filtered = [...testResults];

    // Filter by test ID
    if (filters.testId) {
      console.log('Filtering by testId:', filters.testId);
      filtered = filtered.filter(result => result.test_id === filters.testId);
    }

    // Filter by test name (search in test titles)
    if (filters.testName) {
      console.log('Filtering by testName:', filters.testName);
      const searchTerm = filters.testName.toLowerCase();
      filtered = filtered.filter(result => {
        const test = tests.find(t => t.id === result.test_id);
        return test?.title?.toLowerCase().includes(searchTerm);
      });
    }

    // Filter by subject
    if (filters.subject) {
      console.log('Filtering by subject:', filters.subject);
      filtered = filtered.filter(result => {
        const test = tests.find(t => t.id === result.test_id);
        return test?.subject === filters.subject;
      });
    }

    // Filter by score range
    if (filters.minScore) {
      console.log('Filtering by minScore:', filters.minScore);
      filtered = filtered.filter(result => result.score >= parseInt(filters.minScore));
    }
    if (filters.maxScore) {
      console.log('Filtering by maxScore:', filters.maxScore);
      filtered = filtered.filter(result => result.score <= parseInt(filters.maxScore));
    }

    // Filter by date range
    if (filters.dateFrom) {
      console.log('Filtering by dateFrom:', filters.dateFrom);
      filtered = filtered.filter(result => 
        new Date(result.completed_at) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      console.log('Filtering by dateTo:', filters.dateTo);
      filtered = filtered.filter(result => 
        new Date(result.completed_at) <= new Date(filters.dateTo + 'T23:59:59')
      );
    }

    console.log('TestResults - Filtered results count:', filtered.length);
    setFilteredResults(filtered);
  };

  const exportToExcel = () => {
    const csvContent = [
      ['Student Name', 'Student ID', 'Test Title', 'Subject', 'Score', 'Total Questions', 'Correct Answers', 'Completion Date'].join(','),
      ...filteredResults.map(result => {
        const test = tests.find(t => t.id === result.test_id);
        const profile = profiles.find(p => p.user_id === result.student_id);
        return [
          profile?.name || 'Unknown Student',
          profile?.student_id || result.student_id,
          test?.title || 'Unknown Test',
          test?.subject || 'N/A',
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

  const averageScore = filteredResults.length > 0 
    ? filteredResults.reduce((acc, result) => acc + result.score, 0) / filteredResults.length 
    : 0;
  
  const passRate = filteredResults.length > 0 
    ? (filteredResults.filter(result => result.score >= 60).length / filteredResults.length) * 100 
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Test Results & Analytics</h2>
        <Button 
          onClick={exportToExcel} 
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 modern-shadow hover-lift"
        >
          <Download size={16} />
          Export to Excel
        </Button>
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
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{filteredResults.length}</div>
            <p className="text-xs text-gray-600 mt-1">
              {filteredResults.length !== testResults.length ? 
                `${filteredResults.length} of ${testResults.length} shown` : 
                'Test attempts'
              }
            </p>
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
            <p className="text-xs text-gray-600 mt-1">
              {filteredResults.length !== testResults.length ? 'Filtered results' : 'Class performance'}
            </p>
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
            <p className="text-xs text-gray-600 mt-1">
              {filteredResults.length !== testResults.length ? 'Filtered results' : 'Students scoring ≥60%'}
            </p>
          </CardContent>
        </Card>
      </div>

      <ResultsFilter 
        onFilterChange={handleFilterChange}
        tests={tests}
        showTestFilter={true}
      />

      <Card className="bg-white/80 backdrop-blur-sm border-0 modern-shadow">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Users size={18} className="text-white" />
            </div>
            Detailed Results
          </CardTitle>
          <CardDescription className="text-gray-600">Individual student performance across all tests</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BarChart size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                {testResults.length === 0 ? 'No test submissions yet.' : 'No results match your filters.'}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {testResults.length === 0 ? 'Students will appear here after completing tests.' : 'Try adjusting your filter criteria.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold">Student Name</TableHead>
                    <TableHead className="font-semibold">Test</TableHead>
                    <TableHead className="font-semibold">Subject</TableHead>
                    <TableHead className="font-semibold">Score</TableHead>
                    <TableHead className="font-semibold">Questions</TableHead>
                    <TableHead className="font-semibold">Correct</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result, index) => {
                    const test = tests.find(t => t.id === result.test_id);
                    const studentName = getStudentName(result.student_id);
                    return (
                      <TableRow key={index} className="hover:bg-purple-50/30 transition-colors">
                        <TableCell className="font-medium">{studentName}</TableCell>
                        <TableCell className="max-w-48 truncate" title={test?.title}>{test?.title || 'Unknown Test'}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {test?.subject || 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getScoreBadgeVariant(result.score)} className="font-medium">
                            {result.score}%
                          </Badge>
                        </TableCell>
                        <TableCell>{result.total_questions}</TableCell>
                        <TableCell>
                          <span className="font-medium text-green-600">{result.correct_answers}</span>
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
