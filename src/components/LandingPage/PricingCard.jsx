import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PricingCard({
  name,
  description,
  price,
  period,
  features,
  buttonText,
  buttonVariant = 'primary',
  popular = false,
}) {
  return (
    <div
      className={`flex flex-col rounded-lg border ${
        popular ? 'border-premium-purple/50' : 'border-premium-blue/20'
      } bg-premium-darker p-6 shadow-lg relative`}
    >
      {popular && (
        <div className='absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-premium-purple px-3 py-1 text-xs font-medium text-white'>
          Most Popular
        </div>
      )}
      <div className='space-y-2'>
        <h3 className='text-2xl font-bold'>{name}</h3>
        <p className='text-gray-400'>{description}</p>
      </div>
      <div className='mt-4 space-y-2'>
        <div
          className={`text-4xl font-bold ${
            price === '$15' ? 'premium-text-gradient' : ''
          }`}
        >
          {price}
        </div>
        <p className='text-gray-400'>{period}</p>
      </div>
      <ul className='mt-6 space-y-2 text-sm'>
        {features.map((feature, index) => (
          <li key={index} className='flex items-center gap-2'>
            <CheckCircle className='h-4 w-4 text-premium-cyan' />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className='mt-6'>
        <Button
          className={`w-full ${
            buttonVariant === 'highlight'
              ? 'bg-premium-purple hover:bg-premium-highlight text-white'
              : 'bg-premium-blue hover:bg-premium-purple text-white'
          }`}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
