
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
  const [adminSignupData, setAdminSignupData] = useState({ username: '', password: '', confirmPassword: '', email: '' });
  const [studentSignupData, setStudentSignupData] = useState({ username: '', password: '', confirmPassword: '', email: '' });
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin('admin', adminCredentials);
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin('student', studentCredentials);
  };

  const handleAdminSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminSignupData.password !== adminSignupData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // For demo purposes, we'll treat signup as login
    onLogin('admin', { username: adminSignupData.username, password: adminSignupData.password });
  };

  const handleStudentSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentSignupData.password !== studentSignupData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // For demo purposes, we'll treat signup as login
    onLogin('student', { username: studentSignupData.username, password: studentSignupData.password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">EduTest Platform</CardTitle>
          <CardDescription>
            {isLoginMode ? 'Choose your role to login' : 'Create your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setIsLoginMode(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isLoginMode 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLoginMode(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  !isLoginMode 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

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
            
            {isLoginMode ? (
              <>
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
              </>
            ) : (
              <>
                <TabsContent value="student">
                  <form onSubmit={handleStudentSignup} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Student ID</label>
                      <Input
                        type="text"
                        placeholder="Choose your student ID"
                        value={studentSignupData.username}
                        onChange={(e) => setStudentSignupData({...studentSignupData, username: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={studentSignupData.email}
                        onChange={(e) => setStudentSignupData({...studentSignupData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Password</label>
                      <Input
                        type="password"
                        placeholder="Choose a password"
                        value={studentSignupData.password}
                        onChange={(e) => setStudentSignupData({...studentSignupData, password: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        value={studentSignupData.confirmPassword}
                        onChange={(e) => setStudentSignupData({...studentSignupData, confirmPassword: e.target.value})}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      Sign Up as Student
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="admin">
                  <form onSubmit={handleAdminSignup} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Teacher ID</label>
                      <Input
                        type="text"
                        placeholder="Choose your teacher ID"
                        value={adminSignupData.username}
                        onChange={(e) => setAdminSignupData({...adminSignupData, username: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={adminSignupData.email}
                        onChange={(e) => setAdminSignupData({...adminSignupData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Password</label>
                      <Input
                        type="password"
                        placeholder="Choose a password"
                        value={adminSignupData.password}
                        onChange={(e) => setAdminSignupData({...adminSignupData, password: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        value={adminSignupData.confirmPassword}
                        onChange={(e) => setAdminSignupData({...adminSignupData, confirmPassword: e.target.value})}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                      Sign Up as Teacher
                    </Button>
                  </form>
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
