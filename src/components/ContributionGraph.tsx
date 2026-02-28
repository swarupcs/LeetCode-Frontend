import { useMemo, useRef, useEffect, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ContributionDay {
  date: string;
  count: number;
}

interface ContributionGraphProps {
  data: ContributionDay[];
}

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const DAY_LABEL_WIDTH = 28; // px reserved for Mon/Wed/Fri labels
const GAP = 3; // gap between cells

function getIntensityClass(count: number): string {
  if (count === 0) return 'bg-surface-3/60';
  if (count <= 2) return 'bg-primary/25';
  if (count <= 4) return 'bg-primary/50';
  if (count <= 6) return 'bg-primary/75';
  return 'bg-primary';
}

export default function ContributionGraph({ data }: ContributionGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Observe container width changes
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Fill missing dates with count = 0
  const filledData = useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach((d) => {
      map[d.date] = d.count;
    });

    const days: ContributionDay[] = [];
    const today = new Date();
    for (let i = 363; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({ date: dateStr, count: map[dateStr] ?? 0 });
    }
    return days;
  }, [data]);

  // Group into Sun-Sat weeks (columns)
  const weeks = useMemo(() => {
    const result: (ContributionDay | null)[][] = [];
    let currentWeek: (ContributionDay | null)[] = [];

    const firstDayOfWeek = new Date(filledData[0].date + 'T00:00:00').getDay();
    for (let i = 0; i < firstDayOfWeek; i++) currentWeek.push(null);

    for (const day of filledData) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      result.push(currentWeek);
    }
    return result;
  }, [filledData]);

  // Derive cell size from container width so the graph fills it exactly
  const cellSize = useMemo(() => {
    if (!containerWidth || !weeks.length) return 13;
    const totalGaps = (weeks.length - 1) * GAP;
    const availableWidth = containerWidth - DAY_LABEL_WIDTH - totalGaps;
    return Math.max(8, Math.floor(availableWidth / weeks.length));
  }, [containerWidth, weeks.length]);

  // Month label positions
  const monthMarkers = useMemo(() => {
    const markers: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, weekIdx) => {
      for (const day of week) {
        if (day) {
          const month = new Date(day.date + 'T00:00:00').getMonth();
          if (month !== lastMonth) {
            lastMonth = month;
            markers.push({ label: MONTH_LABELS[month], weekIndex: weekIdx });
            break;
          }
        }
      }
    });
    return markers;
  }, [weeks]);

  const totalSubmissions = filledData.reduce((sum, d) => sum + d.count, 0);
  const activeDays = filledData.filter((d) => d.count > 0).length;
  const gridHeight = 7 * cellSize + 6 * GAP;

  return (
    <div className='space-y-3 w-full'>
      {/* Stats */}
      <div className='flex items-center gap-6 text-xs text-muted-foreground'>
        <span>
          <span className='text-foreground font-semibold tabular-nums'>
            {totalSubmissions}
          </span>{' '}
          submissions in the last year
        </span>
        <span>
          <span className='text-foreground font-semibold tabular-nums'>
            {activeDays}
          </span>{' '}
          active days
        </span>
      </div>

      {/* Measure container width */}
      <div ref={containerRef} className='w-full'>
        {containerWidth > 0 && (
          <TooltipProvider delayDuration={100}>
            <div className='w-full'>
              {/* Month labels */}
              <div
                className='relative h-4 mb-1'
                style={{ paddingLeft: DAY_LABEL_WIDTH }}
              >
                {monthMarkers.map((marker, i) => (
                  <span
                    key={i}
                    className='absolute text-[10px] text-muted-foreground select-none'
                    style={{
                      left:
                        DAY_LABEL_WIDTH + marker.weekIndex * (cellSize + GAP),
                    }}
                  >
                    {marker.label}
                  </span>
                ))}
              </div>

              {/* Day labels + grid row */}
              <div className='flex w-full'>
                {/* Mon / Wed / Fri labels */}
                <div
                  className='flex flex-col justify-between shrink-0'
                  style={{ width: DAY_LABEL_WIDTH, height: gridHeight }}
                >
                  {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, i) => (
                    <span
                      key={i}
                      className='text-[10px] text-muted-foreground leading-none flex items-center'
                      style={{ height: cellSize }}
                    >
                      {label}
                    </span>
                  ))}
                </div>

                {/* Cell columns — flex-1 so they fill remaining width */}
                <div className='flex flex-1' style={{ gap: GAP }}>
                  {weeks.map((week, weekIdx) => (
                    <div
                      key={weekIdx}
                      className='flex flex-col flex-1'
                      style={{ gap: GAP }}
                    >
                      {week.map((day, dayIdx) =>
                        day ? (
                          <Tooltip key={dayIdx}>
                            <TooltipTrigger asChild>
                              <div
                                className={`rounded-[3px] transition-colors hover:ring-1 hover:ring-foreground/30 cursor-pointer w-full ${getIntensityClass(day.count)}`}
                                style={{ height: cellSize }}
                              />
                            </TooltipTrigger>
                            <TooltipContent side='top' className='text-xs'>
                              <span className='font-semibold'>
                                {day.count} submission
                                {day.count !== 1 ? 's' : ''}
                              </span>
                              <span className='text-muted-foreground ml-1.5'>
                                {new Date(
                                  day.date + 'T00:00:00',
                                ).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <div
                            key={dayIdx}
                            className='w-full'
                            style={{ height: cellSize }}
                          />
                        ),
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TooltipProvider>
        )}
      </div>

      {/* Legend */}
      <div className='flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground'>
        <span>Less</span>
        {[0, 1, 3, 5, 7].map((level) => (
          <div
            key={level}
            className={`rounded-[3px] ${getIntensityClass(level)}`}
            style={{ width: 11, height: 11 }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
