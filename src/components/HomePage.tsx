
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, BookOpen, Users, Award } from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <GraduationCap size={48} className="text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">EduTest</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A comprehensive online testing platform that empowers educators to create, manage, and deliver assessments 
            while providing students with an intuitive learning experience. Transform the way you teach and learn with our modern, 
            user-friendly interface designed for academic excellence.
          </p>

          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
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
              <CardTitle>Create Tests</CardTitle>
              <CardDescription>
                Design comprehensive assessments with multiple question types and flexible formatting options.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Users className="text-green-600" size={40} />
              </div>
              <CardTitle>Manage Students</CardTitle>
              <CardDescription>
                Track student progress, view detailed results, and provide personalized feedback to enhance learning.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Award className="text-purple-600" size={40} />
              </div>
              <CardTitle>Track Progress</CardTitle>
              <CardDescription>
                Monitor performance with detailed analytics and insights to improve educational outcomes.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Motivational Quote Section */}
        <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl text-blue-600 mb-4">"</div>
              <blockquote className="text-2xl font-medium text-gray-800 italic leading-relaxed">
                Education is the most powerful weapon which you can use to change the world.
              </blockquote>
            </div>
            <div className="border-t pt-6">
              <p className="text-lg font-semibold text-gray-700">Nelson Mandela</p>
              <p className="text-gray-500">Former President of South Africa & Nobel Peace Prize Winner</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
