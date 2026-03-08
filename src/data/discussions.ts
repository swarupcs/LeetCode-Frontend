// ─── Types ────────────────────────────────────────────────────────────────────

export type DiscussionCategory = 'general' | 'problem' | 'interview' | 'career';

export interface DiscussionAuthor {
  id: string;
  username: string;
  image: string | null;
}

export interface Comment {
  id: string;
  content: string;
  author: DiscussionAuthor;
  discussionId: string;
  parentId: string | null;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
  userVote: -1 | 0 | 1;
  replies: Comment[];
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  contentType: 'text' | 'code';
  codeContent?: string | null;
  codeLanguage?: string | null;
  category: DiscussionCategory;
  tags: string[];
  company?: string | null;
  position?: string | null;
  problemId?: number | null;
  problemTitle?: string | null;
  problemDifficulty?: string | null;
  authorId: string;
  author: DiscussionAuthor;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
  userVote: -1 | 0 | 1;
  bookmarked: boolean;
  commentCount: number;
  comments?: Comment[];
}

// ─── Category helpers ─────────────────────────────────────────────────────────

export const getCategoryStyle = (cat: string) => {
  switch (cat) {
    case 'problem':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'interview':
      return 'bg-accent/10 text-accent border-accent/20';
    case 'career':
      return 'bg-[hsl(var(--amber)/0.1)] text-[hsl(var(--amber))] border-[hsl(var(--amber)/0.2)]';
    case 'general':
      return 'bg-[hsl(var(--cyan)/0.1)] text-[hsl(var(--cyan))] border-[hsl(var(--cyan)/0.2)]';
    default:
      return 'bg-surface-3 text-muted-foreground';
  }
};

export const getCategoryIcon = (cat: string) => {
  switch (cat) {
    case 'problem':
      return '💡';
    case 'interview':
      return '🎯';
    case 'career':
      return '💼';
    case 'general':
      return '💬';
    default:
      return '📝';
  }
};
