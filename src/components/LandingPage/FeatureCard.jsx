export function FeatureCard({ icon, title, description }) {
  return (
    <div className='flex flex-col items-center space-y-2 rounded-lg border border-premium-blue/20 bg-premium-darker p-6 shadow-lg hover:border-premium-purple/50 transition-all duration-300'>
      <div className='rounded-full bg-premium-purple/10 p-3'>{icon}</div>
      <h3 className='text-xl text-center font-bold'>{title}</h3>
      <p className='text-center text-gray-400'>{description}</p>
    </div>
  );
}
