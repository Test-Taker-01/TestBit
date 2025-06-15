import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, GraduationCap, Eye, EyeClosed } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  selectedRole?: 'student' | 'teacher' | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ selectedRole }) => {
  const { signIn, signUp } = useAuth();
  const [adminCredentials, setAdminCredentials] = useState({ email: '', password: '' });
  const [studentCredentials, setStudentCredentials] = useState({ email: '', password: '' });
  const [adminSignupData, setAdminSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [studentSignupData, setStudentSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  // Password visibility states
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [showAdminSignupPassword, setShowAdminSignupPassword] = useState(false);
  const [showAdminSignupConfirmPassword, setShowAdminSignupConfirmPassword] = useState(false);
  const [showStudentSignupPassword, setShowStudentSignupPassword] = useState(false);
  const [showStudentSignupConfirmPassword, setShowStudentSignupConfirmPassword] = useState(false);

  // Determine the default tab based on selected role
  const defaultTab = selectedRole === 'teacher' ? 'admin' : 'student';

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(adminCredentials.email, adminCredentials.password);
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(studentCredentials.email, studentCredentials.password);
  };

  const handleAdminSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminSignupData.password !== adminSignupData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    await signUp(adminSignupData.email, adminSignupData.password, adminSignupData.name, 'admin');
  };

  const handleStudentSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (studentSignupData.password !== studentSignupData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    await signUp(studentSignupData.email, studentSignupData.password, studentSignupData.name, 'student');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">EduTest Platform</CardTitle>
          <CardDescription>
            {isLoginMode ? 
              (selectedRole === 'teacher' ? 'Teacher Login' : 
               selectedRole === 'student' ? 'Student Login' : 
               'Choose your role to login') : 
              (selectedRole === 'teacher' ? 'Create Teacher Account' : 
               selectedRole === 'student' ? 'Create Student Account' : 
               'Create your account')}
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

          {selectedRole ? (
            // Show only the selected role's form
            <div className="w-full">
              {selectedRole === 'student' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 mb-4 text-blue-600">
                    <GraduationCap size={20} />
                    <span className="font-medium">Student {isLoginMode ? 'Login' : 'Registration'}</span>
                  </div>
                  
                  {isLoginMode ? (
                    <form onSubmit={handleStudentLogin} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={studentCredentials.email}
                          onChange={(e) => setStudentCredentials({...studentCredentials, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                          <Input
                            type={showStudentPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={studentCredentials.password}
                            onChange={(e) => setStudentCredentials({...studentCredentials, password: e.target.value})}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowStudentPassword(!showStudentPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showStudentPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        Login as Student
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleStudentSignup} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <Input
                          type="text"
                          placeholder="Enter your full name"
                          value={studentSignupData.name}
                          onChange={(e) => setStudentSignupData({...studentSignupData, name: e.target.value})}
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
                        <div className="relative">
                          <Input
                            type={showStudentSignupPassword ? "text" : "password"}
                            placeholder="Choose a password"
                            value={studentSignupData.password}
                            onChange={(e) => setStudentSignupData({...studentSignupData, password: e.target.value})}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowStudentSignupPassword(!showStudentSignupPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showStudentSignupPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                        <div className="relative">
                          <Input
                            type={showStudentSignupConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={studentSignupData.confirmPassword}
                            onChange={(e) => setStudentSignupData({...studentSignupData, confirmPassword: e.target.value})}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowStudentSignupConfirmPassword(!showStudentSignupConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showStudentSignupConfirmPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        Sign Up as Student
                      </Button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 mb-4 text-indigo-600">
                    <User size={20} />
                    <span className="font-medium">Teacher {isLoginMode ? 'Login' : 'Registration'}</span>
                  </div>
                  
                  {isLoginMode ? (
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={adminCredentials.email}
                          onChange={(e) => setAdminCredentials({...adminCredentials, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                          <Input
                            type={showAdminPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={adminCredentials.password}
                            onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowAdminPassword(!showAdminPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showAdminPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                        Login as Teacher
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleAdminSignup} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <Input
                          type="text"
                          placeholder="Enter your full name"
                          value={adminSignupData.name}
                          onChange={(e) => setAdminSignupData({...adminSignupData, name: e.target.value})}
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
                        <div className="relative">
                          <Input
                            type={showAdminSignupPassword ? "text" : "password"}
                            placeholder="Choose a password"
                            value={adminSignupData.password}
                            onChange={(e) => setAdminSignupData({...adminSignupData, password: e.target.value})}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowAdminSignupPassword(!showAdminSignupPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showAdminSignupPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                        <div className="relative">
                          <Input
                            type={showAdminSignupConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={adminSignupData.confirmPassword}
                            onChange={(e) => setAdminSignupData({...adminSignupData, confirmPassword: e.target.value})}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowAdminSignupConfirmPassword(!showAdminSignupConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showAdminSignupConfirmPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                        Sign Up as Teacher
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Show both tabs when no role is selected (fallback)
            <Tabs defaultValue={defaultTab} className="w-full">
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
              
              {/* ... keep existing code (tab content for both roles) */}
              {isLoginMode ? (
                <>
                  <TabsContent value="student">
                    <form onSubmit={handleStudentLogin} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={studentCredentials.email}
                          onChange={(e) => setStudentCredentials({...studentCredentials, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                          <Input
                            type={showStudentPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={studentCredentials.password}
                            onChange={(e) => setStudentCredentials({...studentCredentials, password: e.target.value})}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowStudentPassword(!showStudentPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showStudentPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        Login as Student
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="admin">
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={adminCredentials.email}
                          onChange={(e) => setAdminCredentials({...adminCredentials, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                          <Input
                            type={showAdminPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={adminCredentials.password}
                            onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowAdminPassword(!showAdminPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showAdminPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
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
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <Input
                          type="text"
                          placeholder="Enter your full name"
                          value={studentSignupData.name}
                          onChange={(e) => setStudentSignupData({...studentSignupData, name: e.target.value})}
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
                        <div className="relative">
                          <Input
                            type={showStudentSignupPassword ? "text" : "password"}
                            placeholder="Choose a password"
                            value={studentSignupData.password}
                            onChange={(e) => setStudentSignupData({...studentSignupData, password: e.target.value})}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowStudentSignupPassword(!showStudentSignupPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showStudentSignupPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                        <div className="relative">
                          <Input
                            type={showStudentSignupConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={studentSignupData.confirmPassword}
                            onChange={(e) => setStudentSignupData({...studentSignupData, confirmPassword: e.target.value})}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowStudentSignupConfirmPassword(!showStudentSignupConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showStudentSignupConfirmPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        Sign Up as Student
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="admin">
                    <form onSubmit={handleAdminSignup} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <Input
                          type="text"
                          placeholder="Enter your full name"
                          value={adminSignupData.name}
                          onChange={(e) => setAdminSignupData({...adminSignupData, name: e.target.value})}
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
                        <div className="relative">
                          <Input
                            type={showAdminSignupPassword ? "text" : "password"}
                            placeholder="Choose a password"
                            value={adminSignupData.password}
                            onChange={(e) => setAdminSignupData({...adminSignupData, password: e.target.value})}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowAdminSignupPassword(!showAdminSignupPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showAdminSignupPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                        <div className="relative">
                          <Input
                            type={showAdminSignupConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={adminSignupData.confirmPassword}
                            onChange={(e) => setAdminSignupData({...adminSignupData, confirmPassword: e.target.value})}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowAdminSignupConfirmPassword(!showAdminSignupConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showAdminSignupConfirmPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                        Sign Up as Teacher
                      </Button>
                    </form>
                  </TabsContent>
                </>
              )}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
