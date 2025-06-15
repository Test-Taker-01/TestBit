
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pen, BookOpen, Users, Award, User, UserCheck } from 'lucide-react';

interface HomePageProps {
  onGetStarted: (role?: 'student' | 'teacher') => void;
}

const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  const handleGetStarted = () => {
    setShowRoleSelection(true);
  };

  const handleRoleSelection = (role: 'student' | 'teacher') => {
    onGetStarted(role);
  };

  if (showRoleSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-600 p-4 rounded-full">
                  <Pen size={48} className="text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl text-gray-900 mb-4 header-text">
                Who are you?
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 proper-line-height">
                Please select your role to continue with the appropriate experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-500"
                  onClick={() => handleRoleSelection('student')}
                >
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <User className="text-blue-600" size={48} />
                    </div>
                    <CardTitle className="text-xl header-text">Student</CardTitle>
                    <CardDescription className="proper-line-height">
                      Take tests, view your results, and track your progress
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-green-500"
                  onClick={() => handleRoleSelection('teacher')}
                >
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <UserCheck className="text-green-600" size={48} />
                    </div>
                    <CardTitle className="text-xl header-text">Teacher</CardTitle>
                    <CardDescription className="proper-line-height">
                      Create tests, manage students, and analyze performance
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div className="text-center pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowRoleSelection(false)}
                  className="text-gray-600 proper-line-height"
                >
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <Pen size={48} className="text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 welcome-text">
            Welcome to <span className="text-blue-600">TestBit</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto proper-line-height">
            A comprehensive online testing platform that empowers educators to create, manage, and deliver assessments 
            while providing students with an intuitive learning experience. Transform the way you teach and learn with our modern, 
            user-friendly interface designed for academic excellence.
          </p>

          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg proper-line-height"
          >
            Get Started
          </Button>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <BookOpen className="text-blue-600" size={40} />
              </div>
              <CardTitle className="header-text">Take Tests</CardTitle>
              <CardDescription className="proper-line-height">
                Access comprehensive assessments with multiple question types and get instant feedback on your performance.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Users className="text-green-600" size={40} />
              </div>
              <CardTitle className="header-text">Track Progress</CardTitle>
              <CardDescription className="proper-line-height">
                Monitor your learning journey with detailed results, performance analytics, and personalized insights.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Award className="text-purple-600" size={40} />
              </div>
              <CardTitle className="header-text">Achieve Excellence</CardTitle>
              <CardDescription className="proper-line-height">
                Improve your knowledge and skills through structured assessments and continuous learning opportunities.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Motivational Quote Section */}
        <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl text-blue-600 mb-4">"</div>
              <blockquote className="text-2xl font-medium text-gray-800 italic leading-relaxed proper-line-height">
                The beautiful thing about learning is that no one can take it away from you.
              </blockquote>
            </div>
            <div className="border-t pt-6">
              <p className="text-lg font-semibold text-gray-700 proper-line-height">B.B. King</p>
              <p className="text-gray-500 proper-line-height">Legendary Blues Musician & Cultural Icon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
