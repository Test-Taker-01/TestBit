
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Award, Clock, Calendar } from 'lucide-react';

interface StudentPerformanceListProps {
  test: any;
  results: any[];
  profiles: any[];
  onBack: () => void;
}

const StudentPerformanceList: React.FC<StudentPerformanceListProps> = ({ 
  test, 
  results, 
  profiles, 
  onBack 
}) => {
  const getStudentName = (studentId: string) => {
    const profile = profiles.find(p => p.user_id === studentId);
    return profile?.name || 'Unknown Student';
  };

  const getStudentId = (studentId: string) => {
    const profile = profiles.find(p => p.user_id === studentId);
    return profile?.student_id || studentId;
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const averageScore = results.length > 0 
    ? results.reduce((acc, result) => acc + result.score, 0) / results.length 
    : 0;

  const passRate = results.length > 0 
    ? (results.filter(result => result.score >= 60).length / results.length) * 100 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          onClick={onBack}
          variant="outline" 
          className="flex items-center gap-2 bg-white/70 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
        >
          <ArrowLeft size={16} />
          Back to Results
        </Button>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {test.title} - Student Performance
          </h2>
          <p className="text-gray-600 mt-1">{results.length} submissions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 modern-shadow hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Total Submissions</CardTitle>
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <User className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{results.length}</div>
            <p className="text-xs text-gray-600 mt-1">Students completed</p>
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
              <Award className="h-4 w-4 text-white" />
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
              <User size={18} className="text-white" />
            </div>
            Student Results
          </CardTitle>
          <CardDescription className="text-gray-600">Individual student performance on this test</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result, index) => (
              <Card 
                key={result.id} 
                className="bg-gradient-to-r from-white to-gray-50/80 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                        <User size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {getStudentName(result.student_id)}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-600">ID: {getStudentId(result.student_id)}</span>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar size={14} />
                            {new Date(result.completed_at).toLocaleDateString()}
                          </div>
                          {result.time_taken && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Clock size={14} />
                              {result.time_taken}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-600">Score</div>
                            <Badge variant={getScoreBadgeVariant(result.score)} className="font-bold text-lg px-3 py-1">
                              {result.score}%
                            </Badge>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-600">Correct Answers</div>
                            <div className="text-lg font-bold text-gray-900">
                              {result.correct_answers}/{result.total_questions}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentPerformanceList;
