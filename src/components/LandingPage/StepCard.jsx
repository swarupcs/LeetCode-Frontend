export function StepCard({ number, title, description, isLast }) {
  return (
    <div className='flex flex-col items-center space-y-4 rounded-lg p-6 relative'>
      <div className='flex h-16 w-16 items-center justify-center rounded-full bg-premium-purple text-xl font-bold text-white animate-glow'>
        {number}
      </div>
      {!isLast && (
        <div className='h-full w-px bg-gradient-to-b from-premium-purple to-transparent absolute -bottom-6 left-1/2 transform -translate-x-1/2 md:hidden'></div>
      )}
      <h3 className='text-xl font-bold'>{title}</h3>
      <p className='text-center text-gray-400'>{description}</p>
    </div>
  );
}
