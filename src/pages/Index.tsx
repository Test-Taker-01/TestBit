
import React, { useState, useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import AdminDashboard from '@/components/AdminDashboard';
import StudentDashboard from '@/components/StudentDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [tests, setTests] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);

  // Fetch tests from Supabase
  useEffect(() => {
    if (user) {
      fetchTests();
      fetchTestResults();
    }
  }, [user]);

  const fetchTests = async () => {
    try {
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tests:', error);
        return;
      }

      setTests(data || []);
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const fetchTestResults = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching test results:', error);
        return;
      }

      setTestResults(data || []);
    } catch (error) {
      console.error('Error fetching test results:', error);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleCreateTest = async (test: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tests')
        .insert([
          {
            title: test.title,
            subject: test.subject,
            duration: test.duration,
            questions: test.questions,
            created_by: user.id,
            is_published: true
          }
        ])
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create test: " + error.message,
          variant: "destructive"
        });
        return;
      }

      setTests([data, ...tests]);
      toast({
        title: "Test Created",
        description: `Test "${test.title}" has been created successfully`,
      });
    } catch (error) {
      console.error('Error creating test:', error);
      toast({
        title: "Error",
        description: "Failed to create test",
        variant: "destructive"
      });
    }
  };

  const handleSubmitTest = async (testId: string, answers: any[]) => {
    if (!user) return;

    const test = tests.find(t => t.id === testId);
    if (!test) return;

    const correctAnswers = answers.filter(answer => answer.isCorrect).length;
    const score = Math.round((correctAnswers / test.questions.length) * 100);

    const result = {
      student_id: user.id,
      test_id: testId,
      answers: answers,
      score: score,
      correct_answers: correctAnswers,
      total_questions: test.questions.length,
      time_taken: '25:30' // Mock time for now
    };

    try {
      const { data, error } = await supabase
        .from('test_results')
        .insert([result])
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to submit test: " + error.message,
          variant: "destructive"
        });
        return;
      }

      setTestResults([data, ...testResults]);
      toast({
        title: "Test Submitted",
        description: `Your score: ${score}% (${correctAnswers}/${test.questions.length})`,
      });
    } catch (error) {
      console.error('Error submitting test:', error);
      toast({
        title: "Error",
        description: "Failed to submit test",
        variant: "destructive"
      });
    }
  };

  const handleAddResource = (resource: any) => {
    setResources([...resources, resource]);
    toast({
      title: "Resource Added",
      description: `Resource "${resource.title}" has been added successfully`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return <LoginForm />;
  }

  if (profile.user_type === 'admin') {
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
      studentResults={testResults.filter(result => result.student_id === user.id)}
      resources={resources}
      studentId={profile.student_id || user.id}
    />
  );
};

export default Index;
