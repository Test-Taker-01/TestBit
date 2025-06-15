
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, BookOpen, Users, Award, User, UserCheck } from 'lucide-react';

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
      <div className="min-h-screen classic-gradient flex items-center justify-center">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto bg-card/95 backdrop-blur-sm shadow-xl border-accent">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-primary p-4 rounded-full shadow-lg">
                  <GraduationCap size={48} className="text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-3xl text-foreground mb-4 header-text">
                Who are you?
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground proper-line-height">
                Please select your role to continue with the appropriate experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-amber-600 bg-card/80"
                  onClick={() => handleRoleSelection('student')}
                >
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <User className="text-amber-700" size={48} />
                    </div>
                    <CardTitle className="text-xl header-text text-foreground">Student</CardTitle>
                    <CardDescription className="proper-line-height text-muted-foreground">
                      Take tests, view your results, and track your progress
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-amber-800 bg-card/80"
                  onClick={() => handleRoleSelection('teacher')}
                >
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <UserCheck className="text-amber-800" size={48} />
                    </div>
                    <CardTitle className="text-xl header-text text-foreground">Teacher</CardTitle>
                    <CardDescription className="proper-line-height text-muted-foreground">
                      Create tests, manage students, and analyze performance
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div className="text-center pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowRoleSelection(false)}
                  className="text-muted-foreground proper-line-height border-border hover:bg-accent"
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
    <div className="min-h-screen classic-gradient">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-card p-4 rounded-full shadow-lg border border-accent">
              <GraduationCap size={48} className="text-primary" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-foreground mb-6 welcome-text">
            Welcome to <span className="text-primary">TestBit</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto proper-line-height">
            A comprehensive online testing platform that empowers educators to create, manage, and deliver assessments 
            while providing students with an intuitive learning experience. Transform the way you teach and learn with our modern, 
            user-friendly interface designed for academic excellence.
          </p>

          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg proper-line-height shadow-lg"
          >
            Get Started
          </Button>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow bg-card/90 border-accent">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <BookOpen className="text-amber-700" size={40} />
              </div>
              <CardTitle className="header-text text-foreground">Take Tests</CardTitle>
              <CardDescription className="proper-line-height text-muted-foreground">
                Access comprehensive assessments with multiple question types and get instant feedback on your performance.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow bg-card/90 border-accent">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Users className="text-amber-800" size={40} />
              </div>
              <CardTitle className="header-text text-foreground">Track Progress</CardTitle>
              <CardDescription className="proper-line-height text-muted-foreground">
                Monitor your learning journey with detailed results, performance analytics, and personalized insights.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow bg-card/90 border-accent">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Award className="text-amber-900" size={40} />
              </div>
              <CardTitle className="header-text text-foreground">Achieve Excellence</CardTitle>
              <CardDescription className="proper-line-height text-muted-foreground">
                Improve your knowledge and skills through structured assessments and continuous learning opportunities.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Motivational Quote Section */}
        <Card className="max-w-4xl mx-auto bg-card/90 backdrop-blur-sm border-accent shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl text-primary mb-4">"</div>
              <blockquote className="text-2xl font-medium text-foreground italic leading-relaxed proper-line-height">
                The beautiful thing about learning is that no one can take it away from you.
              </blockquote>
            </div>
            <div className="border-t border-accent pt-6">
              <p className="text-lg font-semibold text-foreground proper-line-height">B.B. King</p>
              <p className="text-muted-foreground proper-line-height">Legendary Blues Musician & Cultural Icon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
