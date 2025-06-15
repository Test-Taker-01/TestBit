
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, BarChart, Users, BookOpen, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TestCreator from './TestCreator';
import TestResults from './TestResults';
import ResourceManager from './ResourceManager';

interface AdminDashboardProps {
  onLogout: () => void;
  tests: any[];
  onCreateTest: (test: any) => void;
  testResults: any[];
  resources: any[];
  onAddResource: (resource: any) => void;
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
  profiles,
  onDeleteTest
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showTestCreator, setShowTestCreator] = useState(false);
  const navigate = useNavigate();

  const totalStudents = new Set(testResults.map(result => result.student_id)).size;
  const averageScore = testResults.length > 0 
    ? testResults.reduce((acc, result) => acc + result.score, 0) / testResults.length 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => navigate('/profile')} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <User size={16} />
              Profile
            </Button>
            <Button onClick={onLogout} variant="outline" className="flex items-center gap-2">
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tests.length}</div>
                  <p className="text-xs text-muted-foreground">Active tests</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalStudents}</div>
                  <p className="text-xs text-muted-foreground">Registered students</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">Overall performance</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your classroom efficiently</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button onClick={() => setShowTestCreator(true)} className="flex items-center gap-2">
                  <Plus size={16} />
                  Create New Test
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('results')} className="flex items-center gap-2">
                  <BarChart size={16} />
                  View Results
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('resources')} className="flex items-center gap-2">
                  <BookOpen size={16} />
                  Manage Resources
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Tests</h2>
                <Button onClick={() => setShowTestCreator(true)} className="flex items-center gap-2">
                  <Plus size={16} />
                  Create New Test
                </Button>
              </div>

              <div className="grid gap-4">
                {tests.map((test) => (
                  <Card key={test.id}>
                    <CardHeader>
                      <CardTitle>{test.title}</CardTitle>
                      <CardDescription>
                        {test.questions.length} questions • Created {new Date(test.created_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Status: <span className="font-medium text-green-600">Published</span>
                        </span>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">View Results</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results">
            <TestResults 
              testResults={testResults} 
              tests={tests} 
              profiles={profiles}
              onDeleteTest={onDeleteTest}
            />
          </TabsContent>

          <TabsContent value="resources">
            <ResourceManager resources={resources} onAddResource={onAddResource} />
          </TabsContent>
        </Tabs>
      </div>

      {showTestCreator && (
        <TestCreator
          onClose={() => setShowTestCreator(false)}
          onCreateTest={onCreateTest}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
