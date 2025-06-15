
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Filter, ChevronDown, ChevronUp, Search } from 'lucide-react';

interface ResultsFilterProps {
  onFilterChange: (filters: FilterState) => void;
  tests: any[];
  showTestFilter?: boolean;
}

export interface FilterState {
  testId: string;
  testName: string;
  subject: string;
  minScore: string;
  maxScore: string;
  dateFrom: string;
  dateTo: string;
}

const ResultsFilter: React.FC<ResultsFilterProps> = ({ 
  onFilterChange, 
  tests, 
  showTestFilter = true 
}) => {
  const [filters, setFilters] = React.useState<FilterState>({
    testId: '',
    testName: '',
    subject: '',
    minScore: '',
    maxScore: '',
    dateFrom: '',
    dateTo: ''
  });

  const [isExpanded, setIsExpanded] = React.useState(false);

  const uniqueSubjects = [...new Set(tests.map(test => test.subject).filter(Boolean))];

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      testId: '',
      testName: '',
      subject: '',
      minScore: '',
      maxScore: '',
      dateFrom: '',
      dateTo: ''
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 modern-shadow hover-lift">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Filter size={18} className="text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Filter Results
            </span>
          </CardTitle>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
              >
                <X size={14} />
                Clear Filters
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showTestFilter && (
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  📝 Test Selection
                </label>
                <Select 
                  value={filters.testId} 
                  onValueChange={(value) => handleFilterChange('testId', value)}
                >
                  <SelectTrigger className="border-purple-200 focus:border-purple-400 focus:ring-purple-200 bg-white/90">
                    <SelectValue placeholder="All tests" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-sm border-purple-200">
                    <SelectItem value="">All tests</SelectItem>
                    {tests.map((test) => (
                      <SelectItem key={test.id} value={test.id}>
                        {test.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Search size={14} />
                Test Name
              </label>
              <Input
                type="text"
                placeholder="Search by test name..."
                value={filters.testName}
                onChange={(e) => handleFilterChange('testName', e.target.value)}
                className="border-purple-200 focus:border-purple-400 focus:ring-purple-200 bg-white/90"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                📚 Subject
              </label>
              <Select 
                value={filters.subject} 
                onValueChange={(value) => handleFilterChange('subject', value)}
              >
                <SelectTrigger className="border-orange-200 focus:border-orange-400 focus:ring-orange-200 bg-white/90">
                  <SelectValue placeholder="All subjects" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm border-orange-200">
                  <SelectItem value="">All subjects</SelectItem>
                  {uniqueSubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                📊 Min Score (%)
              </label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={filters.minScore}
                onChange={(e) => handleFilterChange('minScore', e.target.value)}
                className="border-green-200 focus:border-green-400 focus:ring-green-200 bg-white/90"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                📈 Max Score (%)
              </label>
              <Input
                type="number"
                placeholder="100"
                min="0"
                max="100"
                value={filters.maxScore}
                onChange={(e) => handleFilterChange('maxScore', e.target.value)}
                className="border-green-200 focus:border-green-400 focus:ring-green-200 bg-white/90"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                📅 Date From
              </label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-200 bg-white/90"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                📅 Date To
              </label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-200 bg-white/90"
              />
            </div>
          </div>
          
          {hasActiveFilters && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-600">Active Filters:</span>
                {filters.testId && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Test: {tests.find(t => t.id === filters.testId)?.title || 'Selected'}
                  </span>
                )}
                {filters.testName && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Name: {filters.testName}
                  </span>
                )}
                {filters.subject && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Subject: {filters.subject}
                  </span>
                )}
                {filters.minScore && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Min: {filters.minScore}%
                  </span>
                )}
                {filters.maxScore && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Max: {filters.maxScore}%
                  </span>
                )}
                {filters.dateFrom && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    From: {new Date(filters.dateFrom).toLocaleDateString()}
                  </span>
                )}
                {filters.dateTo && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    To: {new Date(filters.dateTo).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default ResultsFilter;
