
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
          className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border-accent text-foreground hover:bg-accent hover:border-primary transition-all duration-300 proper-line-height"
        >
          <ArrowLeft size={16} />
          Back to Results
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-foreground header-text">
            {test.title} - Student Performance
          </h2>
          <p className="text-muted-foreground mt-1 proper-line-height">{results.length} submissions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/90 backdrop-blur-sm hover-lift border border-accent modern-shadow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-foreground proper-line-height">Total Submissions</CardTitle>
            <div className="p-2 classic-accent-gradient rounded-lg modern-shadow">
              <User className="h-4 w-4 text-amber-900" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary header-text">{results.length}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium proper-line-height">Students completed</p>
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
              <Award className="h-4 w-4 text-amber-900" />
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
              <User size={18} className="text-amber-900" />
            </div>
            <span className="header-text">Student Results</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground proper-line-height">Individual student performance on this test</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result, index) => (
              <Card 
                key={result.id} 
                className="bg-card/95 backdrop-blur-sm border border-accent hover:border-primary hover-lift transition-all duration-300 modern-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 classic-accent-gradient rounded-lg modern-shadow">
                        <User size={20} className="text-amber-900" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground header-text">
                          {getStudentName(result.student_id)}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-muted-foreground proper-line-height">ID: {getStudentId(result.student_id)}</span>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground proper-line-height">
                            <Calendar size={14} className="text-amber-700" />
                            {new Date(result.completed_at).toLocaleDateString()}
                          </div>
                          {result.time_taken && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground proper-line-height">
                              <Clock size={14} className="text-amber-800" />
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
                            <div className="text-sm font-medium text-muted-foreground proper-line-height">Score</div>
                            <Badge variant={getScoreBadgeVariant(result.score)} className="font-bold text-lg px-3 py-1 proper-line-height">
                              {result.score}%
                            </Badge>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-muted-foreground proper-line-height">Correct Answers</div>
                            <div className="text-lg font-bold text-primary header-text">
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
