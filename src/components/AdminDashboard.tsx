
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, BarChart, Users, BookOpen, LogOut, User, GraduationCap, Award, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TestCreator from './TestCreator';
import TestResults from './TestResults';
import ResourceManager from './ResourceManager';
import StudentsList from './StudentsList';
import { useAuth } from '@/contexts/AuthContext';

interface AdminDashboardProps {
  onLogout: () => void;
  tests: any[];
  onCreateTest: (test: any) => void;
  testResults: any[];
  resources: any[];
  onAddResource: (resource: any) => void;
  onUpdateResource: (resource: any) => void;
  onDeleteResource: (resourceId: string) => void;
  profiles: any[];
  onDeleteTest: (testId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onLogout, 
  tests, 
  onCreateTest, 
  testResults,
  resources,
  onAddResource,
  onUpdateResource,
  onDeleteResource,
  profiles,
  onDeleteTest
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showTestCreator, setShowTestCreator] = useState(false);
  const [editingTest, setEditingTest] = useState<any>(null);
  const navigate = useNavigate();
  const { profile } = useAuth();

  const totalStudents = new Set(testResults.map(result => result.student_id)).size;
  const averageScore = testResults.length > 0 
    ? testResults.reduce((acc, result) => acc + result.score, 0) / testResults.length 
    : 0;

  const handleEditTest = (test: any) => {
    setEditingTest(test);
    setShowTestCreator(true);
  };

  const handleViewTestResults = (testId: string) => {
    setActiveTab('results');
    // The TestResults component will handle filtering by test when we pass the testId
  };

  const handleCloseTestCreator = () => {
    setShowTestCreator(false);
    setEditingTest(null);
  };

  const handleUpdateTest = (updatedTest: any) => {
    // For now, we'll treat this as creating a new test
    // In a real implementation, you'd want to have an onUpdateTest prop
    onCreateTest(updatedTest);
    setEditingTest(null);
  };

  return (
    <div className="min-h-screen classic-gradient">
      <header className="bg-card/95 backdrop-blur-md shadow-lg border-b border-accent sticky top-0 z-50">
        <div className="px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 classic-accent-gradient rounded-xl modern-shadow">
              <GraduationCap size={24} className="text-amber-900" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground welcome-text">
                Welcome, {profile?.name || 'Teacher'}! 👨‍🏫
              </h1>
              <p className="text-muted-foreground mt-1 proper-line-height">Manage your classroom with ease</p>
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
          <TabsList className="grid w-full grid-cols-5 bg-card/90 backdrop-blur-sm modern-shadow rounded-xl p-1 border border-accent">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-300 font-semibold proper-line-height">Overview</TabsTrigger>
            <TabsTrigger value="tests" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-300 font-semibold proper-line-height">Tests</TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-300 font-semibold proper-line-height">Results</TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-300 font-semibold proper-line-height">Students</TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-300 font-semibold proper-line-height">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card/90 backdrop-blur-sm hover-lift border border-accent modern-shadow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-foreground proper-line-height">Total Tests</CardTitle>
                  <div className="p-2 classic-accent-gradient rounded-lg modern-shadow">
                    <FileText className="h-4 w-4 text-amber-900" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary header-text">{tests.length}</div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium proper-line-height">Active tests</p>
                </CardContent>
              </Card>

              <Card className="bg-card/90 backdrop-blur-sm hover-lift border border-accent modern-shadow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-foreground proper-line-height">Students</CardTitle>
                  <div className="p-2 classic-accent-gradient rounded-lg modern-shadow">
                    <Users className="h-4 w-4 text-amber-900" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary header-text">{totalStudents}</div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium proper-line-height">Registered students</p>
                </CardContent>
              </Card>

              <Card className="bg-card/90 backdrop-blur-sm hover-lift border border-accent modern-shadow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-foreground proper-line-height">Average Score</CardTitle>
                  <div className="p-2 classic-accent-gradient rounded-lg modern-shadow">
                    <BarChart className="h-4 w-4 text-amber-900" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary header-text">{averageScore.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium proper-line-height">Overall performance</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/90 backdrop-blur-sm hover-lift border border-accent modern-shadow">
              <CardHeader>
                <CardTitle className="text-xl text-foreground flex items-center gap-3">
                  <div className="p-2 classic-accent-gradient rounded-lg modern-shadow">
                    <GraduationCap size={20} className="text-amber-900" />
                  </div>
                  <span className="header-text">Quick Actions</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground proper-line-height">Manage your classroom efficiently</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => setShowTestCreator(true)} 
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground modern-shadow hover-lift proper-line-height"
                >
                  <Plus size={16} />
                  Create New Test
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('results')} 
                  className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border-accent text-foreground hover:bg-accent hover:border-primary transition-all duration-300 proper-line-height"
                >
                  <BarChart size={16} />
                  View Results
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('resources')} 
                  className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border-accent text-foreground hover:bg-accent hover:border-primary transition-all duration-300 proper-line-height"
                >
                  <BookOpen size={16} />
                  Manage Resources
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests" className="mt-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 classic-accent-gradient rounded-xl modern-shadow">
                    <FileText size={24} className="text-amber-900" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground header-text">My Tests</h2>
                </div>
                <Button 
                  onClick={() => setShowTestCreator(true)} 
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground modern-shadow hover-lift proper-line-height"
                >
                  <Plus size={16} />
                  Create New Test
                </Button>
              </div>

              <div className="grid gap-6">
                {tests.map((test) => (
                  <Card key={test.id} className="bg-card/95 backdrop-blur-sm hover-lift border border-accent modern-shadow transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 classic-accent-gradient rounded-lg modern-shadow">
                          <FileText size={16} className="text-amber-900" />
                        </div>
                        <span className="header-text text-foreground">{test.title}</span>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1 proper-line-height">
                          <Award size={14} className="text-amber-700" />
                          {test.questions.length} questions
                        </span>
                        <span className="flex items-center gap-1 proper-line-height">
                          <TrendingUp size={14} className="text-amber-800" />
                          Created {new Date(test.created_at).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          Status: <span className="px-3 py-1 classic-accent-gradient text-amber-900 rounded-full text-xs font-semibold modern-shadow proper-line-height">Published</span>
                        </span>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-accent text-foreground hover:bg-accent hover:border-primary proper-line-height"
                            onClick={() => handleEditTest(test)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-accent text-foreground hover:bg-accent hover:border-primary proper-line-height"
                            onClick={() => handleViewTestResults(test.id)}
                          >
                            View Results
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="mt-8">
            <TestResults 
              testResults={testResults} 
              tests={tests} 
              profiles={profiles}
              onDeleteTest={onDeleteTest}
            />
          </TabsContent>

          <TabsContent value="students" className="mt-8">
            <StudentsList profiles={profiles} />
          </TabsContent>

          <TabsContent value="resources" className="mt-8">
            <ResourceManager 
              resources={resources} 
              onAddResource={onAddResource}
              onUpdateResource={onUpdateResource}
              onDeleteResource={onDeleteResource}
            />
          </TabsContent>
        </Tabs>
      </div>

      {showTestCreator && (
        <TestCreator
          onClose={handleCloseTestCreator}
          onCreateTest={editingTest ? handleUpdateTest : onCreateTest}
          initialTest={editingTest}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
