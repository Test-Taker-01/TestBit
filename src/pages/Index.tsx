import React, { useState, useEffect } from 'react';
import HomePage from '@/components/HomePage';
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
  const [profiles, setProfiles] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);

  // Fetch data when user and profile are available
  useEffect(() => {
    if (user && profile) {
      fetchTests();
      fetchTestResults();
      fetchProfiles();
      fetchResources();
    }
  }, [user, profile]);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching resources:', error);
        return;
      }

      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        console.error('Error fetching profiles:', error);
        return;
      }

      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const fetchTests = async () => {
    setDataLoading(true);
    try {
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tests:', error);
        toast({
          title: "Error",
          description: "Failed to load tests",
          variant: "destructive"
        });
        return;
      }

      setTests(data || []);
    } catch (error) {
      console.error('Error fetching tests:', error);
      toast({
        title: "Error",
        description: "Failed to load tests",
        variant: "destructive"
      });
    } finally {
      setDataLoading(false);
    }
  };

  const fetchTestResults = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('test_results')
        .select('*')
        .order('completed_at', { ascending: false });

      // If student, only fetch their results
      if (profile?.user_type === 'student') {
        query = query.eq('student_id', user.id);
      }

      const { data, error } = await query;

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

  const handleDeleteTest = async (testId: string) => {
    try {
      // First delete test results
      const { error: resultError } = await supabase
        .from('test_results')
        .delete()
        .eq('test_id', testId);

      if (resultError) {
        toast({
          title: "Error",
          description: "Failed to delete test results: " + resultError.message,
          variant: "destructive"
        });
        return;
      }

      // Then delete the test
      const { error: testError } = await supabase
        .from('tests')
        .delete()
        .eq('id', testId);

      if (testError) {
        toast({
          title: "Error",
          description: "Failed to delete test: " + testError.message,
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setTests(tests.filter(test => test.id !== testId));
      setTestResults(testResults.filter(result => result.test_id !== testId));
      
      toast({
        title: "Test Deleted",
        description: "Test and all associated results have been deleted",
      });
    } catch (error) {
      console.error('Error deleting test:', error);
      toast({
        title: "Error",
        description: "Failed to delete test",
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

  const handleAddResource = async (resource: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('resources')
        .insert([
          {
            title: resource.title,
            description: resource.description,
            subject: resource.subject,
            course: resource.course,
            type: resource.type,
            drive_link: resource.driveLink,
            content: resource.content,
            created_by: user.id
          }
        ])
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add resource: " + error.message,
          variant: "destructive"
        });
        return;
      }

      setResources([data, ...resources]);
      toast({
        title: "Resource Added",
        description: `Resource "${resource.title}" has been added successfully`,
      });
    } catch (error) {
      console.error('Error adding resource:', error);
      toast({
        title: "Error",
        description: "Failed to add resource",
        variant: "destructive"
      });
    }
  };

  const handleUpdateResource = async (resource: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('resources')
        .update({
          title: resource.title,
          description: resource.description,
          subject: resource.subject,
          course: resource.course,
          type: resource.type,
          drive_link: resource.driveLink,
          content: resource.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', resource.id)
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update resource: " + error.message,
          variant: "destructive"
        });
        return;
      }

      setResources(resources.map(r => r.id === resource.id ? data : r));
      toast({
        title: "Resource Updated",
        description: `Resource "${resource.title}" has been updated successfully`,
      });
    } catch (error) {
      console.error('Error updating resource:', error);
      toast({
        title: "Error",
        description: "Failed to update resource",
        variant: "destructive"
      });
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete resource: " + error.message,
          variant: "destructive"
        });
        return;
      }

      setResources(resources.filter(r => r.id !== resourceId));
      toast({
        title: "Resource Deleted",
        description: "Resource has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive"
      });
    }
  };

  const handleGetStarted = (role?: 'student' | 'teacher') => {
    setSelectedRole(role || null);
    setShowLogin(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    if (!showLogin) {
      return <HomePage onGetStarted={handleGetStarted} />;
    }
    return <LoginForm selectedRole={selectedRole} />;
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
        onUpdateResource={handleUpdateResource}
        onDeleteResource={handleDeleteResource}
        profiles={profiles}
        onDeleteTest={handleDeleteTest}
      />
    );
  }

  return (
    <StudentDashboard
      onLogout={handleLogout}
      tests={tests}
      onSubmitTest={handleSubmitTest}
      studentResults={testResults}
      resources={resources}
      studentId={profile.student_id || user.id}
      studentName={profile.name}
    />
  );
};

export default Index;
