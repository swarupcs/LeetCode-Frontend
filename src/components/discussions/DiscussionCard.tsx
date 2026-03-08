import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, MessageSquare, Trash2, Code2, Building2 } from 'lucide-react';
import { VoteButton } from './VoteButton';
import { getCategoryStyle, getCategoryIcon } from '@/data/discussions';
import type { Discussion } from '@/data/discussions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DiscussionCardProps {
  discussion: Discussion;
  index: number;
  currentUserId: string | null;
  onVote: (id: string, vote: -1 | 0 | 1) => void;
  onClick: (id: string) => void;
  onDelete?: (id: string) => void;
  isVotePending?: boolean;
}

export function DiscussionCard({
  discussion,
  index,
  currentUserId,
  onVote,
  onClick,
  onDelete,
  isVotePending = false,
}: DiscussionCardProps) {
  const isOwn = !!currentUserId && discussion.author.id === currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.04 }}
    >
      <Card
        className='glass-card border-border/50 hover:border-primary/30 transition-all duration-200 cursor-pointer group'
        onClick={() => onClick(discussion.id)}
      >
        <CardContent className='p-5'>
          <div className='flex gap-4'>
            <VoteButton
              upvotes={discussion.upvotes}
              downvotes={discussion.downvotes}
              userVote={discussion.userVote}
              onVote={(vote) => onVote(discussion.id, vote)}
              disabled={isVotePending}
            />

            <div className='flex-1 min-w-0'>
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                  <Badge
                    variant='outline'
                    className={`text-[10px] px-2 py-0 h-5 ${getCategoryStyle(
                      discussion.category,
                    )}`}
                  >
                    <span className='mr-1'>
                      {getCategoryIcon(discussion.category)}
                    </span>
                    {discussion.category}
                  </Badge>
                  {discussion.contentType === 'code' && (
                    <span className='flex items-center gap-0.5 text-[10px] text-muted-foreground border border-border/40 rounded px-1.5 h-5'>
                      <Code2 className='h-3 w-3' />
                      code
                    </span>
                  )}
                  {discussion.isEdited && (
                    <span className='text-[10px] text-muted-foreground italic'>
                      edited
                    </span>
                  )}
                </div>

                {isOwn && onDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity shrink-0'
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className='h-3.5 w-3.5' />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your discussion post.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(discussion.id);
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>

              <h3 className='text-base font-semibold mb-1.5 group-hover:text-primary transition-colors line-clamp-1'>
                {discussion.title}
              </h3>

              <p className='text-sm text-muted-foreground line-clamp-2 mb-3'>
                {discussion.content
                  .replace(/```[\s\S]*?```/g, '[code snippet]')
                  .replace(/\|[\s\S]*?\|/g, '')
                  .substring(0, 160)}
              </p>

              <div className='flex flex-wrap gap-1.5 mb-3'>
                {discussion.tags.map((tag) => (
                  <span
                    key={tag}
                    className='text-[10px] px-2 py-0.5 rounded-full bg-surface-3 text-muted-foreground border border-border/30'
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {discussion.category === 'interview' &&
                (discussion.company || discussion.position) && (
                  <div className='flex items-center gap-1 text-[10px] text-muted-foreground mb-3'>
                    <Building2 className='h-3 w-3 shrink-0' />
                    <span>
                      {[discussion.company, discussion.position]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  </div>
                )}

              <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                <div className='flex items-center gap-1.5'>
                  <Avatar className='h-5 w-5'>
                    {discussion.author.image && (
                      <AvatarImage src={discussion.author.image} />
                    )}
                    <AvatarFallback className='bg-primary/10 text-primary text-[9px] font-bold'>
                      {discussion.author.username?.[0]?.toUpperCase() ?? '?'}
                    </AvatarFallback>
                  </Avatar>
                  <span className='font-medium'>{discussion.author.username}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Clock className='h-3 w-3' />
                  <span>
                    {formatDistanceToNow(new Date(discussion.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <MessageSquare className='h-3 w-3' />
                  <span>{discussion.commentCount}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
