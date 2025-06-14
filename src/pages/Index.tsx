
import React, { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import AdminDashboard from '@/components/AdminDashboard';
import StudentDashboard from '@/components/StudentDashboard';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  type: 'admin' | 'student';
  name: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tests, setTests] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);

  const handleLogin = (userType: 'admin' | 'student', credentials: { username: string; password: string }) => {
    // Simple demo authentication
    if (credentials.username && credentials.password) {
      setUser({
        id: credentials.username,
        type: userType,
        name: userType === 'admin' ? 'Teacher' : 'Student'
      });
      toast({
        title: "Login Successful",
        description: `Welcome ${userType === 'admin' ? 'Teacher' : 'Student'}!`,
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter valid credentials",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const handleCreateTest = (test: any) => {
    setTests([...tests, test]);
    toast({
      title: "Test Created",
      description: `Test "${test.title}" has been created successfully`,
    });
  };

  const handleSubmitTest = (testId: string, answers: any[]) => {
    const test = tests.find(t => t.id === testId);
    if (!test) return;

    const correctAnswers = answers.filter(answer => answer.isCorrect).length;
    const score = Math.round((correctAnswers / test.questions.length) * 100);

    const result = {
      studentId: user?.id,
      testId: testId,
      answers: answers,
      score: score,
      correctAnswers: correctAnswers,
      totalQuestions: test.questions.length,
      completedAt: new Date().toISOString(),
      timeTaken: '25:30' // Mock time
    };

    setTestResults([...testResults, result]);
    toast({
      title: "Test Submitted",
      description: `Your score: ${score}% (${correctAnswers}/${test.questions.length})`,
    });
  };

  const handleAddResource = (resource: any) => {
    setResources([...resources, resource]);
    toast({
      title: "Resource Added",
      description: `Resource "${resource.title}" has been added successfully`,
    });
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (user.type === 'admin') {
    return (
      <AdminDashboard
        onLogout={handleLogout}
        tests={tests}
        onCreateTest={handleCreateTest}
        testResults={testResults}
        resources={resources}
        onAddResource={handleAddResource}
      />
    );
  }

  return (
    <StudentDashboard
      onLogout={handleLogout}
      tests={tests}
      onSubmitTest={handleSubmitTest}
      studentResults={testResults.filter(result => result.studentId === user.id)}
      resources={resources}
      studentId={user.id}
    />
  );
};

export default Index;
