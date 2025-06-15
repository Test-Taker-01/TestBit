
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Filter } from 'lucide-react';

interface ResultsFilterProps {
  onFilterChange: (filters: FilterState) => void;
  tests: any[];
  showTestFilter?: boolean;
}

export interface FilterState {
  testId: string;
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
    minScore: '',
    maxScore: '',
    dateFrom: '',
    dateTo: ''
  });

  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      testId: '',
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
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter size={18} />
            Filter Results
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                className="flex items-center gap-1"
              >
                <X size={14} />
                Clear
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {showTestFilter && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Test</label>
                <Select 
                  value={filters.testId} 
                  onValueChange={(value) => handleFilterChange('testId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All tests" />
                  </SelectTrigger>
                  <SelectContent>
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Min Score (%)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={filters.minScore}
                onChange={(e) => handleFilterChange('minScore', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Score (%)</label>
              <Input
                type="number"
                placeholder="100"
                min="0"
                max="100"
                value={filters.maxScore}
                onChange={(e) => handleFilterChange('maxScore', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date From</label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date To</label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ResultsFilter;
