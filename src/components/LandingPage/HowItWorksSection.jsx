import { SectionHeader } from "./SectionHeader";
import { StepCard } from "./StepCard";


export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: 'Choose a Problem',
      description:
        'Browse our extensive library of coding challenges filtered by difficulty, topic, or company.',
    },
    {
      number: 2,
      title: 'Solve & Submit',
      description:
        'Write your solution in our interactive coding environment and submit it to see if it passes all test cases.',
    },
    {
      number: 3,
      title: 'Learn & Improve',
      description:
        'Review other solutions, participate in discussions, and track your progress as you improve.',
    },
  ];

  return (
    <section
      id='how-it-works'
      className='w-full py-12 md:py-24 lg:py-32 bg-premium-darker relative'
    >
      <div className='absolute inset-0 bg-gradient-to-t from-premium-blue/5 to-transparent'></div>
      <div className='container px-4 md:px-6 relative z-10'>
        <SectionHeader
          badge='How It Works'
          title='Simple. Effective. Rewarding.'
          description='Our platform is designed to make your coding practice efficient and enjoyable.'
        />
        <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3'>
          {steps.map((step, index) => (
            <StepCard
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
