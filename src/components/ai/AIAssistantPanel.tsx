import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Lightbulb,
  Code2,
  Gauge,
  Sparkles,
  Bot,
  Loader2,
  Trash2,
  Send,
  User,
} from 'lucide-react';
import AIMarkdownContent from './AIMarkdownContent';

// ─── Types ───────────────────────────────────────────────────────

type AIAction = 'hint' | 'analyze-code' | 'analyze-complexity' | 'chat';

interface AIMessage {
  id: string;
  action: AIAction;
  label: string;
  content: string;
  timestamp: Date;
  role: 'assistant' | 'user';
}

const actionConfig: Record<
  Exclude<AIAction, 'chat'>,
  { label: string; icon: typeof Lightbulb; description: string }
> = {
  hint: {
    label: 'Get Hint',
    icon: Lightbulb,
    description: 'Get a contextual hint without spoiling the solution',
  },
  'analyze-code': {
    label: 'Analyze Code',
    icon: Code2,
    description: 'Review your code for bugs, style, and improvements',
  },
  'analyze-complexity': {
    label: 'Complexity',
    icon: Gauge,
    description: 'Analyze time & space complexity of your solution',
  },
};

// ─── Mock responses ──────────────────────────────────────────────

const mockHints = [
  `**Think about the data structure.**\n\nConsider using a hash map to store values you've already seen. This can help you find the complement in constant time rather than scanning the entire array for each element.\n\n💡 *Try to reduce the problem from O(n²) to O(n) by trading space for time.*`,
  `**Focus on the edge cases.**\n\nWhat happens when the input is empty or has only one element? Also consider whether the same element can be used twice.\n\n💡 *Drawing out a small example on paper often reveals the pattern.*`,
  `**Sliding window approach.**\n\nIf the problem involves contiguous subarrays or substrings, a sliding window might be the key. Expand the window when conditions are met, shrink it otherwise.\n\n💡 *Keep track of the window boundaries with two pointers.*`,
];

const mockAnalysis = [
  `## Code Review\n\n**Overall:** Your solution is functional but can be improved.\n\n### Issues Found\n- **Line 3:** Variable naming could be more descriptive — \`d\` → \`lookup_map\`\n- **Line 7:** Redundant check — the \`in\` operator already handles this\n- **Line 12:** Consider using \`enumerate()\` instead of manual indexing\n\n### Suggestions\n1. Add input validation for edge cases\n2. Use type hints for better readability\n3. Consider early return to reduce nesting\n\n✅ *No logical bugs detected. The algorithm is correct.*`,
  `## Code Review\n\n**Overall:** Clean and well-structured solution.\n\n### Strengths\n- Good use of hash map for O(1) lookups\n- Proper handling of edge cases\n- Clear variable naming\n\n### Minor Suggestions\n- Consider adding comments for complex logic blocks\n- The inner loop could be simplified with a list comprehension\n- Return type annotation would improve readability\n\n✅ *Solution passes all expected test cases.*`,
];

const mockComplexity = [
  `## Complexity Analysis\n\n### Time Complexity: **O(n)**\n\nThe algorithm iterates through the array once, performing constant-time hash map operations at each step.\n\n| Operation | Complexity |\n|-----------|------------|\n| Loop | O(n) |\n| Hash lookup | O(1) avg |\n| Hash insert | O(1) avg |\n| **Total** | **O(n)** |\n\n### Space Complexity: **O(n)**\n\nIn the worst case, we store all n elements in the hash map before finding a match.\n\n### Verdict\n🟢 **Optimal** — This matches the best known time complexity for this problem.`,
  `## Complexity Analysis\n\n### Time Complexity: **O(n²)**\n\nThe nested loop structure causes quadratic time growth.\n\n| Operation | Complexity |\n|-----------|------------|\n| Outer loop | O(n) |\n| Inner loop | O(n) |\n| **Total** | **O(n²)** |\n\n### Space Complexity: **O(1)**\n\nNo additional data structures used beyond a few variables.\n\n### Verdict\n🟡 **Suboptimal** — Consider using a hash map to reduce time complexity to O(n) at the cost of O(n) space.`,
];

const mockChatResponses = [
  `Great question! The key insight here is that **you don't need to check every pair**. Instead, for each element, calculate what value you'd need to find (the "complement"), and check if you've already seen it.\n\nThis is a classic example of the **space-time tradeoff** — using extra memory to avoid redundant computation.`,
  `**Yes, that approach would work!** However, consider the time complexity. With a brute-force nested loop, you're looking at O(n²). \n\nA more efficient approach would be:\n1. Iterate once through the array\n2. For each element, check a hash map\n3. If not found, store the current element\n\nThis brings it down to **O(n)** time with **O(n)** space.`,
  `That's a common confusion! Let me clarify:\n\n- **In-place** means modifying the input directly without allocating a new data structure of the same size\n- You *can* still use O(1) extra variables\n- The key constraint is **no auxiliary array/list** of size n\n\n💡 *Two pointers or swapping elements are typical in-place techniques.*`,
  `Good thinking! Here's how to handle that edge case:\n\n\`\`\`\nif not nums or len(nums) < 2:\n    return []\n\`\`\`\n\nAlways validate your input at the start. This prevents index errors and makes your solution more robust.\n\n*Also consider: what should you return when there are multiple valid answers?*`,
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Component ───────────────────────────────────────────────────

interface AIAssistantPanelProps {
  problemTitle: string;
  code: string;
  language: string;
}

export default function AIAssistantPanel({
  problemTitle,
  code,
  language,
}: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<AIAction | null>(null);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingId]);

  const simulateStreaming = useCallback(
    (action: Exclude<AIAction, 'chat'>) => {
      if (isLoading) return;

      setIsLoading(true);
      setLoadingAction(action);

      const fullContent =
        action === 'hint'
          ? pickRandom(mockHints)
          : action === 'analyze-code'
            ? pickRandom(mockAnalysis)
            : pickRandom(mockComplexity);

      const msgId = crypto.randomUUID();

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: msgId,
            action,
            label: actionConfig[action].label,
            content: '',
            timestamp: new Date(),
            role: 'assistant',
          },
        ]);
        setStreamingId(msgId);

        let index = 0;
        const chunkSize = 3;
        const interval = setInterval(() => {
          index += chunkSize;
          if (index >= fullContent.length) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === msgId ? { ...m, content: fullContent } : m,
              ),
            );
            setStreamingId(null);
            setIsLoading(false);
            setLoadingAction(null);
            clearInterval(interval);
          } else {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === msgId
                  ? { ...m, content: fullContent.slice(0, index) }
                  : m,
              ),
            );
          }
        }, 15);
      }, 600);
    },
    [isLoading],
  );

  const handleChatSubmit = useCallback(() => {
    const trimmed = chatInput.trim();
    if (!trimmed || isLoading) return;

    // Add user message
    const userMsgId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        action: 'chat',
        label: 'You',
        content: trimmed,
        timestamp: new Date(),
        role: 'user',
      },
    ]);
    setChatInput('');

    // Simulate AI response
    setIsLoading(true);
    setLoadingAction('chat');

    const fullContent = pickRandom(mockChatResponses);
    const aiMsgId = crypto.randomUUID();

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          action: 'chat',
          label: 'AI Assistant',
          content: '',
          timestamp: new Date(),
          role: 'assistant',
        },
      ]);
      setStreamingId(aiMsgId);

      let index = 0;
      const chunkSize = 3;
      const interval = setInterval(() => {
        index += chunkSize;
        if (index >= fullContent.length) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsgId ? { ...m, content: fullContent } : m,
            ),
          );
          setStreamingId(null);
          setIsLoading(false);
          setLoadingAction(null);
          clearInterval(interval);
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsgId
                ? { ...m, content: fullContent.slice(0, index) }
                : m,
            ),
          );
        }
      }, 15);
    }, 600);
  }, [chatInput, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit();
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setStreamingId(null);
  };

  const quickActions: Exclude<AIAction, 'chat'>[] = [
    'hint',
    'analyze-code',
    'analyze-complexity',
  ];

  return (
    <div className='h-full flex flex-col'>
      {/* Messages area */}
      <div ref={scrollRef} className='flex-1 overflow-auto p-4 space-y-4'>
        {messages.length === 0 && !isLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='flex flex-col items-center justify-center h-full text-center px-4'
          >
            <div className='w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4'>
              <Sparkles className='h-6 w-6 text-primary' />
            </div>
            <h3 className='text-sm font-semibold mb-1'>AI Assistant</h3>
            <p className='text-xs text-muted-foreground mb-6 max-w-[240px]'>
              Ask questions, get hints, or analyze your code — all powered by
              AI.
            </p>
            <div className='space-y-2 w-full max-w-[280px]'>
              {quickActions.map((action) => {
                const config = actionConfig[action];
                const Icon = config.icon;
                return (
                  <button
                    key={action}
                    onClick={() => simulateStreaming(action)}
                    className='w-full flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-surface-1/50 hover:bg-surface-2/60 hover:border-primary/30 transition-all text-left group'
                  >
                    <div className='w-8 h-8 rounded-lg bg-surface-3 flex items-center justify-center group-hover:bg-primary/10 transition-colors'>
                      <Icon className='h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors' />
                    </div>
                    <div>
                      <div className='text-xs font-medium text-foreground'>
                        {config.label}
                      </div>
                      <div className='text-[10px] text-muted-foreground'>
                        {config.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const isStreaming = streamingId === msg.id;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='space-y-2'
                >
                  {/* Label */}
                  <div className='flex items-center gap-2'>
                    {isUser ? (
                      <>
                        <div className='w-5 h-5 rounded-md bg-muted flex items-center justify-center'>
                          <User className='h-3 w-3 text-muted-foreground' />
                        </div>
                        <span className='text-[11px] font-medium text-muted-foreground'>
                          You
                        </span>
                      </>
                    ) : (
                      <>
                        <div className='w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center'>
                          {msg.action !== 'chat' ? (
                            (() => {
                              const Icon =
                                actionConfig[
                                  msg.action as Exclude<AIAction, 'chat'>
                                ].icon;
                              return <Icon className='h-3 w-3 text-primary' />;
                            })()
                          ) : (
                            <Bot className='h-3 w-3 text-primary' />
                          )}
                        </div>
                        <span className='text-[11px] font-medium text-primary'>
                          {msg.action !== 'chat'
                            ? actionConfig[
                                msg.action as Exclude<AIAction, 'chat'>
                              ].label
                            : 'AI Assistant'}
                        </span>
                      </>
                    )}
                    <span className='text-[10px] text-muted-foreground ml-auto'>
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Content */}
                  {isUser ? (
                    <div className='rounded-lg border border-border/30 bg-muted/30 p-3'>
                      <p className='text-xs text-foreground/90 leading-relaxed'>
                        {msg.content}
                      </p>
                    </div>
                  ) : (
                    <div className='rounded-lg border border-border/30 bg-surface-1/40 p-4'>
                      <div className='text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap'>
                        <AIMarkdownContent content={msg.content} />
                        {isStreaming && (
                          <span className='inline-block w-1.5 h-3.5 bg-primary/70 animate-pulse ml-0.5 align-middle rounded-sm' />
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {/* Loading indicator (before message appears) */}
        {isLoading && !streamingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='flex items-center gap-2 p-3'
          >
            <Bot className='h-4 w-4 text-primary' />
            <div className='flex items-center gap-1.5'>
              <Loader2 className='h-3 w-3 animate-spin text-primary' />
              <span className='text-xs text-muted-foreground'>
                {loadingAction === 'hint'
                  ? 'Generating hint…'
                  : loadingAction === 'analyze-code'
                    ? 'Analyzing your code…'
                    : loadingAction === 'analyze-complexity'
                      ? 'Computing complexity…'
                      : 'Thinking…'}
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom action bar */}
      <div className='border-t border-border/50 p-3 space-y-2'>
        {messages.length > 0 && (
          <div className='flex items-center justify-between mb-1'>
            <span className='text-[10px] text-muted-foreground'>
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={clearMessages}
              className='text-[10px] text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1'
            >
              <Trash2 className='h-3 w-3' />
              Clear
            </button>
          </div>
        )}

        {/* Quick action buttons */}
        <div className='flex gap-2'>
          {quickActions.map((action) => {
            const config = actionConfig[action];
            const Icon = config.icon;
            const isCurrentLoading = isLoading && loadingAction === action;

            return (
              <Button
                key={action}
                variant='outline'
                size='sm'
                onClick={() => simulateStreaming(action)}
                disabled={isLoading}
                className='flex-1 h-8 text-[11px] gap-1.5 border-border/40 bg-surface-1/50 hover:bg-surface-2/60 hover:border-primary/30 disabled:opacity-40'
              >
                {isCurrentLoading ? (
                  <Loader2 className='h-3 w-3 animate-spin' />
                ) : (
                  <Icon className='h-3 w-3' />
                )}
                {config.label}
              </Button>
            );
          })}
        </div>

        {/* Chat input */}
        <div className='flex items-end gap-2'>
          <div className='flex-1 relative'>
            <textarea
              ref={inputRef}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Ask a follow-up question…'
              disabled={isLoading}
              rows={1}
              className='w-full resize-none rounded-lg border border-border/40 bg-surface-1/50 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-40 disabled:cursor-not-allowed max-h-[80px] overflow-auto'
              style={{ minHeight: '36px' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = '36px';
                target.style.height = Math.min(target.scrollHeight, 80) + 'px';
              }}
            />
          </div>
          <Button
            size='icon'
            onClick={handleChatSubmit}
            disabled={isLoading || !chatInput.trim()}
            className='h-9 w-9 shrink-0 bg-primary hover:bg-primary/90 disabled:opacity-40'
          >
            {isLoading && loadingAction === 'chat' ? (
              <Loader2 className='h-3.5 w-3.5 animate-spin' />
            ) : (
              <Send className='h-3.5 w-3.5' />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
