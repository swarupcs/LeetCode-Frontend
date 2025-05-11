import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from './SectionHeader';
import { PricingCard } from './PricingCard';


export function PricingSection() {
  const pricingPlans = [
    {
      name: 'Free',
      description: 'Perfect for getting started',
      price: '$0',
      period: 'Forever free',
      features: [
        '100+ Basic Problems',
        'Community Discussions',
        'Basic Progress Tracking',
      ],
      buttonText: 'Get Started',
      buttonVariant: 'primary',
      popular: false,
    },
    {
      name: 'Pro',
      description: 'For serious programmers',
      price: '$15',
      period: 'per month',
      features: [
        'All Free Features',
        '1000+ Advanced Problems',
        'Company-specific Questions',
        'Advanced Analytics',
      ],
      buttonText: 'Subscribe',
      buttonVariant: 'highlight',
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'For teams and companies',
      price: 'Custom',
      period: 'Contact for pricing',
      features: [
        'All Pro Features',
        'Team Management',
        'Custom Problem Sets',
        'Dedicated Support',
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'primary',
      popular: false,
    },
  ];

  return (
    <section
      id='pricing'
      className='w-full py-12 md:py-24 lg:py-32 bg-premium-dark relative'
    >
      <div className='absolute inset-0 bg-gradient-to-b from-premium-blue/5 to-transparent'></div>
      <div className='container px-4 md:px-6 relative z-10'>
        <SectionHeader
          badge='Pricing'
          title='Simple, Transparent Pricing'
          description="Choose the plan that's right for you and start improving your coding skills today."
        />
        <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3'>
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              name={plan.name}
              description={plan.description}
              price={plan.price}
              period={plan.period}
              features={plan.features}
              buttonText={plan.buttonText}
              buttonVariant={plan.buttonVariant}
              popular={plan.popular}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
