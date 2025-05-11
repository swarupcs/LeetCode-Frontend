export function SectionHeader({ badge, title, description }) {
  return (
    <div className='flex flex-col items-center justify-center space-y-4 text-center'>
      <div className='space-y-2'>
        {badge && (
          <div className='inline-block rounded-lg bg-premium-purple px-3 py-1 text-sm text-white'>
            {badge}
          </div>
        )}
        <h2 className='text-3xl font-bold tracking-tighter md:text-4xl'>
          <span className='premium-text-gradient'>{title}</span>
        </h2>
        <p className='max-w-[700px] text-gray-400 md:text-xl'>{description}</p>
      </div>
    </div>
  );
}
