import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoteButtonProps {
  upvotes: number;
  downvotes: number;
  userVote: -1 | 0 | 1;
  onVote: (vote: -1 | 0 | 1) => void;
  size?: 'sm' | 'md';
  horizontal?: boolean;
  disabled?: boolean;
}

export function VoteButton({
  upvotes,
  downvotes,
  userVote,
  onVote,
  size = 'md',
  horizontal = false,
  disabled = false,
}: VoteButtonProps) {
  const score = upvotes - downvotes;
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onVote(userVote === 1 ? 0 : 1);
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onVote(userVote === -1 ? 0 : -1);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-0.5 shrink-0',
        horizontal ? 'flex-row gap-1' : 'flex-col',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      <button
        onClick={handleUpvote}
        disabled={disabled}
        className={cn(
          'p-1 rounded-md transition-all duration-200',
          disabled
            ? 'cursor-not-allowed'
            : userVote === 1
              ? 'text-primary bg-primary/10'
              : 'text-muted-foreground hover:text-primary hover:bg-primary/5',
          !disabled && userVote === 1 && 'text-primary bg-primary/10',
        )}
        aria-label='Upvote'
      >
        <ChevronUp className={iconSize} />
      </button>
      <span
        className={cn(
          'font-semibold tabular-nums',
          size === 'sm' ? 'text-xs' : 'text-sm',
          score > 0
            ? 'text-primary'
            : score < 0
              ? 'text-destructive'
              : 'text-muted-foreground',
        )}
      >
        {score}
      </span>
      <button
        onClick={handleDownvote}
        disabled={disabled}
        className={cn(
          'p-1 rounded-md transition-all duration-200',
          disabled
            ? 'cursor-not-allowed'
            : userVote === -1
              ? 'text-destructive bg-destructive/10'
              : 'text-muted-foreground hover:text-destructive hover:bg-destructive/5',
          !disabled && userVote === -1 && 'text-destructive bg-destructive/10',
        )}
        aria-label='Downvote'
      >
        <ChevronDown className={iconSize} />
      </button>
    </div>
  );
}
