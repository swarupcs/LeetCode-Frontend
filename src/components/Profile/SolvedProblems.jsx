import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, CheckCircle2, XCircle } from 'lucide-react';

export function SolvedProblems({ userSubmissions }) {
  console.log('userSubmissions', userSubmissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');

  // Extract unique values for filters
  const difficulties = [
    'all',
    ...new Set(userSubmissions?.map((sub) => sub.problemDifficulty)),
  ];
  const statuses = [
    'all',
    ...new Set(userSubmissions?.map((sub) => sub.status)),
  ];
  const languages = [
    'all',
    ...new Set(userSubmissions?.map((sub) => sub.language)),
  ];

  // Filter submissions based on search and filters
  const filteredSubmissions = userSubmissions?.filter((submission) => {
    const matchesSearch =
      submission.problemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (submission.tags &&
        submission.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    const matchesDifficulty =
      difficultyFilter === 'all' ||
      submission.problemDifficulty === difficultyFilter;
    const matchesStatus =
      statusFilter === 'all' || submission.status === statusFilter;
    const matchesLanguage =
      languageFilter === 'all' || submission.language === languageFilter;

    return (
      matchesSearch && matchesDifficulty && matchesStatus && matchesLanguage
    );
  });

  // Function to get badge variant based on status
  const getStatusVariant = (status) => {
    if (status === 'Accepted') return 'success';
    if (status === 'Wrong Answer') return 'destructive';
    return 'outline';
  };

  // Function to get badge variant based on difficulty
  const getDifficultyVariant = (difficulty) => {
    if (difficulty === 'EASY') return 'success';
    if (difficulty === 'MEDIUM') return 'warning';
    if (difficulty === 'HARD') return 'destructive';
    return 'outline';
  };

  // Function to get status icon
  const StatusIcon = ({ status }) => {
    if (status === 'Accepted') {
      return <CheckCircle2 className='h-5 w-5 text-green-500' />;
    }
    return <XCircle className='h-5 w-5 text-red-500' />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solved Problems</CardTitle>
        <CardDescription>Track your problem-solving journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col md:flex-row gap-4 mb-6'>
          <div className='relative flex-1'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search problems or tags...'
              className='pl-8'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className='flex flex-wrap gap-2'>
            <Select
              value={difficultyFilter}
              onValueChange={setDifficultyFilter}
            >
              <SelectTrigger className='w-[130px]'>
                <Filter className='mr-2 h-4 w-4' />
                <SelectValue placeholder='Difficulty' />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Difficulties' : difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[130px]'>
                <Filter className='mr-2 h-4 w-4' />
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === 'all' ? 'All Statuses' : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger className='w-[130px]'>
                <Filter className='mr-2 h-4 w-4' />
                <SelectValue placeholder='Language' />
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language === 'all' ? 'All Languages' : language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='space-y-4'>
          {filteredSubmissions?.length > 0 ? (
            filteredSubmissions?.map((submission) => (
              <div
                key={submission.id}
                className='flex flex-col md:flex-row justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors'
              >
                <div className='flex-1'>
                  <div className='flex items-center gap-2'>
                    <StatusIcon status={submission.status} />
                    <h3 className='font-medium'>{submission.problemName}</h3>
                    <Badge
                      variant={getDifficultyVariant(
                        submission.problemDifficulty
                      )}
                    >
                      {submission.problemDifficulty}
                    </Badge>
                    <Badge variant={getStatusVariant(submission.status)}>
                      {submission.status}
                    </Badge>
                  </div>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {submission.tags &&
                      submission.tags.map((tag) => (
                        <Badge key={tag} variant='outline'>
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </div>
                <div className='flex flex-col md:items-end mt-2 md:mt-0 text-sm text-muted-foreground'>
                  <div>Submitted on {submission.date}</div>
                  <div>Language: {submission.language}</div>
                  <div>Runtime: {submission.runtime}</div>
                  <div>Memory: {submission.memory}</div>
                </div>
              </div>
            ))
          ) : (
            <div className='text-center py-10 text-muted-foreground'>
              No submissions found matching your filters.
            </div>
          )}
        </div>

        {filteredSubmissions?.length > 0 && (
          <div className='flex justify-center mt-6'>
            <Button variant='outline'>Load More</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
