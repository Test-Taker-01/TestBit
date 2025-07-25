
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, BarChart, Clock, LogOut, User, Trophy, Target, TrendingUp, Star, Calendar, Award, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FullScreenTestInterface from './FullScreenTestInterface';
import StudentTestDetail from './StudentTestDetail';
import ResourceManager from './ResourceManager';

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
  const [selectedTestDetail, setSelectedTestDetail] = useState<{ test: any; result: any } | null>(null);
  const navigate = useNavigate();

  const averageScore = studentResults.length > 0 
    ? studentResults.reduce((acc, result) => acc + result.score, 0) / studentResults.length 
    : 0;

  const completedTests = studentResults.length;
  const availableTests = tests.length;

  const handleViewTestDetail = (result: any) => {
    const test = tests.find(t => t.id === result.test_id);
    if (test) {
      setSelectedTestDetail({ test, result });
    }
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

  if (selectedTestDetail) {
    return (
      <StudentTestDetail
        test={selectedTestDetail.test}
        result={selectedTestDetail.result}
        onBack={() => setSelectedTestDetail(null)}
      />
    );
  }

  return (
    <div className="min-h-screen classic-gradient">
      <header className="bg-card/95 backdrop-blur-md shadow-lg border-b border-accent sticky top-0 z-40">
        <div className="px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 classic-accent-gradient rounded-xl modern-shadow">
              <Star size={24} className="text-amber-900" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground welcome-text">
                Welcome, {studentName}! 🎓
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => navigate('/profile')} 
              variant="outline" 
              className="flex items-center gap-2 hover-lift border-accent text-foreground hover:border-primary hover:bg-accent bg-card/80 backdrop-blur-sm transition-all duration-300 proper-line-height"
            >
              <User size={16} />
              Profile
            </Button>
            <Button 
              onClick={onLogout} 
              variant="outline" 
              className="flex items-center gap-2 hover-lift border-accent text-muted-foreground hover:border-destructive hover:bg-destructive/10 bg-card/80 backdrop-blur-sm transition-all duration-300 proper-line-height"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-card/90 backdrop-blur-sm modern-shadow rounded-xl p-1 border border-accent">
            <TabsTrigger 
              value="tests" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-300 font-semibold proper-line-height"
            >
              Available Tests
            </TabsTrigger>
            <TabsTrigger 
              value="results"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-300 font-semibold proper-line-height"
            >
              My Results
            </TabsTrigger>
            <TabsTrigger 
              value="resources"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-300 font-semibold proper-line-height"
            >
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tests" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card/90 backdrop-blur-sm hover-lift border border-accent modern-shadow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-foreground proper-line-height">Available Tests</CardTitle>
                  <div className="p-2 classic-accent-gradient rounded-lg modern-shadow">
                    <FileText className="h-4 w-4 text-amber-900" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary header-text">
                    {availableTests}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium proper-line-height">Ready to take</p>
                </CardContent>
              </Card>

              <Card className="bg-card/90 backdrop-blur-sm hover-lift border border-accent modern-shadow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-foreground proper-line-height">Completed</CardTitle>
                  <div className="p-2 classic-accent-gradient rounded-lg modern-shadow">
                    <Trophy className="h-4 w-4 text-amber-900" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary header-text">
                    {completedTests}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium proper-line-height">Tests completed</p>
                </CardContent>
              </Card>

              <Card className="bg-card/90 backdrop-blur-sm hover-lift border border-accent modern-shadow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-foreground proper-line-height">Average Score</CardTitle>
                  <div className="p-2 classic-accent-gradient rounded-lg modern-shadow">
                    <TrendingUp className="h-4 w-4 text-amber-900" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary header-text">
                    {averageScore.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium proper-line-height">Your performance</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6">
              {tests.map((test) => {
                const hasCompleted = studentResults.some(result => result.test_id === test.id);
                const result = studentResults.find(result => result.test_id === test.id);
                return (
                  <Card key={test.id} className="bg-card/95 backdrop-blur-sm hover-lift border border-accent modern-shadow transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center text-foreground">
                        <div className="flex items-center gap-3">
                          <div className="p-2 classic-accent-gradient rounded-lg">
                            <FileText size={18} className="text-amber-900" />
                          </div>
                          <span className="text-xl font-bold header-text">{test.title}</span>
                        </div>
                        {hasCompleted && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold modern-shadow flex items-center gap-2 proper-line-height">
                              <Award size={14} />
                              {result?.score}% • Completed
                            </span>
                          </div>
                        )}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground font-medium ml-12">
                        <div className="flex items-center gap-4 flex-wrap proper-line-height">
                          <span className="flex items-center gap-1">
                            <FileText size={14} className="text-amber-700" />
                            {test.questions.length} questions
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} className="text-amber-800" />
                            {test.duration} minutes
                          </span>
                          {test.subject && (
                            <span className="flex items-center gap-1">
                              <Target size={14} className="text-amber-900" />
                              {test.subject}
                            </span>
                          )}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground flex items-center gap-4">
                          <span className="flex items-center gap-2 proper-line-height">
                            <Calendar size={16} className="text-amber-700" />
                            Duration: {test.duration} minutes
                          </span>
                          {hasCompleted && result && (
                            <span className="flex items-center gap-2 text-primary font-semibold proper-line-height">
                              <Trophy size={16} />
                              Score: {result.score}%
                            </span>
                          )}
                        </div>
                        <Button 
                          onClick={() => setSelectedTest(test)}
                          disabled={hasCompleted}
                          className={`${hasCompleted 
                            ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                            : 'bg-primary hover:bg-primary/90 text-primary-foreground modern-shadow hover-lift'
                          } transition-all duration-300 font-semibold px-6 proper-line-height`}
                        >
                          {hasCompleted ? '✓ Already Completed' : '🚀 Start Test'}
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
              <div className="flex items-center gap-4">
                <div className="p-3 classic-accent-gradient rounded-xl modern-shadow">
                  <BarChart size={24} className="text-amber-900" />
                </div>
                <h2 className="text-3xl font-bold text-foreground header-text">
                  My Test Results
                </h2>
              </div>

              {studentResults.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-8 bg-card/95 backdrop-blur-sm rounded-2xl modern-shadow max-w-md mx-auto border border-accent">
                    <div className="p-4 classic-warm-gradient rounded-full w-fit mx-auto mb-6">
                      <Target className="h-12 w-12 text-amber-800" />
                    </div>
                    <p className="text-foreground text-xl font-semibold mb-2 proper-line-height">No test results yet.</p>
                    <p className="text-muted-foreground text-sm proper-line-height">Take your first test to see results here! 🎯</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {studentResults.map((result) => {
                    const test = tests.find(t => t.id === result.test_id);
                    if (!test) return null;
                    
                    const scoreColor = result.score >= 80 ? 'bg-emerald-600' : 
                                     result.score >= 60 ? 'bg-amber-600' : 'bg-red-600';
                    const scoreIcon = result.score >= 80 ? '🏆' : result.score >= 60 ? '👍' : '📚';
                    
                    return (
                      <Card 
                        key={result.id} 
                        className="bg-card/95 backdrop-blur-sm hover-lift border border-accent modern-shadow transition-all duration-300 cursor-pointer group"
                        onClick={() => handleViewTestDetail(result)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-3 classic-accent-gradient rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <FileText size={20} className="text-amber-900" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors header-text">{test.title}</h3>
                                <div className="flex items-center gap-3">
                                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold text-white ${scoreColor} modern-shadow proper-line-height`}>
                                    <span>{scoreIcon}</span>
                                    {result.score}%
                                  </span>
                                  <span className="text-muted-foreground text-sm font-medium flex items-center gap-1 proper-line-height">
                                    <Calendar size={14} className="text-amber-700" />
                                    {new Date(result.completed_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-sm text-foreground font-medium proper-line-height">
                                  {result.correct_answers} / {result.total_questions}
                                </div>
                                <div className="text-xs text-muted-foreground proper-line-height">
                                  correct answers
                                </div>
                              </div>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 bg-primary text-primary-foreground border-primary hover:bg-primary/90 modern-shadow proper-line-height"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewTestDetail(result);
                                }}
                              >
                                <Eye size={14} />
                                View Details
                              </Button>
                            </div>
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
            <ResourceManager
              resources={resources}
              onAddResource={() => {}} // Students can't add resources
              userType="student"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
