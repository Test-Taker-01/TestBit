
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, GraduationCap } from 'lucide-react';

interface LoginFormProps {
  onLogin: (userType: 'admin' | 'student', credentials: { username: string; password: string }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [studentCredentials, setStudentCredentials] = useState({ username: '', password: '' });

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin('admin', adminCredentials);
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin('student', studentCredentials);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">EduTest Platform</CardTitle>
          <CardDescription>Choose your role to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student" className="flex items-center gap-2">
                <GraduationCap size={16} />
                Student
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <User size={16} />
                Teacher
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="student">
              <form onSubmit={handleStudentLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Student ID</label>
                  <Input
                    type="text"
                    placeholder="Enter your student ID"
                    value={studentCredentials.username}
                    onChange={(e) => setStudentCredentials({...studentCredentials, username: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={studentCredentials.password}
                    onChange={(e) => setStudentCredentials({...studentCredentials, password: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Login as Student
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Teacher ID</label>
                  <Input
                    type="text"
                    placeholder="Enter your teacher ID"
                    value={adminCredentials.username}
                    onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={adminCredentials.password}
                    onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Login as Teacher
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
