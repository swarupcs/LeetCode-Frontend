import { Code, Zap, Users, Trophy, Github } from 'lucide-react';

import { FeatureCard } from './FeatureCard';
import { SectionHeader } from './SectionHeader';


export function FeaturesSection() {
  const features = [
    {
      icon: <Code className='h-6 w-6 text-premium-cyan' />,
      title: '1000+ Coding Problems',
      description:
        'Practice with a vast library of problems across different difficulty levels and categories.',
    },
    {
      icon: <Zap className='h-6 w-6 text-premium-cyan' />,
      title: 'Interactive Coding Environment',
      description:
        'Code directly in your browser with support for multiple programming languages and real-time feedback.',
    },
    {
      icon: <Users className='h-6 w-6 text-premium-cyan' />,
      title: 'Community Discussions',
      description:
        'Learn from others by exploring different approaches and explanations for each problem.',
    },
    {
      icon: <Trophy className='h-6 w-6 text-premium-cyan' />,
      title: 'Contests & Leaderboards',
      description:
        'Participate in weekly coding contests and see how you rank against other programmers.',
    },
    {
      icon: <Github className='h-6 w-6 text-premium-cyan' />,
      title: 'Progress Tracking',
      description:
        'Track your progress over time with detailed statistics and performance metrics.',
    },
    {
      icon: <Users className='h-6 w-6 text-premium-cyan' />,
      title: 'Mock Interviews',
      description:
        'Prepare for technical interviews with realistic mock interview sessions and feedback.',
    },
  ];

  return (
    <section
      id='features'
      className='w-full py-12 md:py-24 lg:py-32 bg-premium-dark relative'
    >
      <div className='absolute inset-0 bg-gradient-to-b from-premium-blue/5 to-transparent'></div>
      <div className='container px-4 md:px-6 relative z-10'>
        <SectionHeader
          badge='Features'
          title='Everything You Need to Excel'
          description='Our platform provides all the tools and resources you need to become a better programmer and ace your technical interviews.'
        />
        <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
