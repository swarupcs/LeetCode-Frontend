import { useMemo } from 'react';
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

function generateMockData(): ContributionDay[] {
  const days: ContributionDay[] = [];
  const now = new Date();
  // Go back ~52 weeks (364 days)
  for (let i = 363; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    // Weight recent days higher for realism
    const recencyBoost = Math.max(0, 1 - i / 364);
    const rand = Math.random();
    let count = 0;
    if (rand < 0.3 + recencyBoost * 0.2) {
      count = 0;
    } else if (rand < 0.6) {
      count = Math.ceil(Math.random() * 2);
    } else if (rand < 0.85) {
      count = Math.ceil(Math.random() * 4 + 2);
    } else {
      count = Math.ceil(Math.random() * 6 + 4);
    }
    days.push({
      date: date.toISOString().split('T')[0],
      count,
    });
  }
  return days;
}

const CELL_SIZE = 13;
const CELL_GAP = 3;
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

function getIntensityClass(count: number): string {
  if (count === 0) return 'bg-surface-3/60';
  if (count <= 2) return 'bg-primary/25';
  if (count <= 4) return 'bg-primary/50';
  if (count <= 6) return 'bg-primary/75';
  return 'bg-primary';
}

export default function ContributionGraph() {
  const data = useMemo(() => generateMockData(), []);

  // Group data into weeks (columns), each week has up to 7 days (rows: Sun-Sat)
  const weeks = useMemo(() => {
    const result: (ContributionDay | null)[][] = [];
    let currentWeek: (ContributionDay | null)[] = [];

    // Pad first week with nulls for alignment
    const firstDayOfWeek = new Date(data[0].date).getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    for (const day of data) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return result;
  }, [data]);

  // Month labels with their starting week index
  const monthMarkers = useMemo(() => {
    const markers: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, weekIdx) => {
      for (const day of week) {
        if (day) {
          const month = new Date(day.date).getMonth();
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

  const totalSubmissions = data.reduce((sum, d) => sum + d.count, 0);
  const activeDays = data.filter((d) => d.count > 0).length;

  const gridWidth = weeks.length * (CELL_SIZE + CELL_GAP);

  return (
    <div className='space-y-4'>
      {/* Stats row */}
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

      {/* Graph */}
      <div className='overflow-x-auto pb-2'>
        <TooltipProvider delayDuration={100}>
          <div className='inline-block'>
            {/* Month labels */}
            <div
              className='flex ml-[30px] mb-1.5'
              style={{ gap: `${CELL_GAP}px` }}
            >
              {monthMarkers.map((marker, i) => (
                <div
                  key={i}
                  className='text-[10px] text-muted-foreground'
                  style={{
                    position: 'relative',
                    left: `${marker.weekIndex * (CELL_SIZE + CELL_GAP)}px`,
                    ...(i > 0 ? { position: 'absolute' as const } : {}),
                  }}
                >
                  {/* Render via absolute positioning */}
                </div>
              ))}
            </div>
            <div className='relative' style={{ paddingTop: '16px' }}>
              {/* Month labels absolutely positioned */}
              {monthMarkers.map((marker, i) => (
                <span
                  key={i}
                  className='absolute text-[10px] text-muted-foreground select-none'
                  style={{
                    top: 0,
                    left: `${30 + marker.weekIndex * (CELL_SIZE + CELL_GAP)}px`,
                  }}
                >
                  {marker.label}
                </span>
              ))}

              <div className='flex gap-0'>
                {/* Day labels */}
                <div
                  className='flex flex-col justify-between mr-2 shrink-0'
                  style={{
                    height: `${7 * (CELL_SIZE + CELL_GAP) - CELL_GAP}px`,
                  }}
                >
                  {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, i) => (
                    <span
                      key={i}
                      className='text-[10px] text-muted-foreground leading-none h-[13px] flex items-center'
                    >
                      {label}
                    </span>
                  ))}
                </div>

                {/* Grid */}
                <div className='flex' style={{ gap: `${CELL_GAP}px` }}>
                  {weeks.map((week, weekIdx) => (
                    <div
                      key={weekIdx}
                      className='flex flex-col'
                      style={{ gap: `${CELL_GAP}px` }}
                    >
                      {week.map((day, dayIdx) =>
                        day ? (
                          <Tooltip key={dayIdx}>
                            <TooltipTrigger asChild>
                              <div
                                className={`rounded-[3px] transition-colors hover:ring-1 hover:ring-foreground/30 cursor-pointer ${getIntensityClass(day.count)}`}
                                style={{ width: CELL_SIZE, height: CELL_SIZE }}
                              />
                            </TooltipTrigger>
                            <TooltipContent side='top' className='text-xs'>
                              <span className='font-semibold'>
                                {day.count} submission
                                {day.count !== 1 ? 's' : ''}
                              </span>
                              <span className='text-muted-foreground ml-1.5'>
                                {new Date(day.date).toLocaleDateString(
                                  'en-US',
                                  {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  },
                                )}
                              </span>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <div
                            key={dayIdx}
                            style={{ width: CELL_SIZE, height: CELL_SIZE }}
                          />
                        ),
                      )}
                      {/* Pad remaining days in last week */}
                      {week.length < 7 &&
                        Array.from({ length: 7 - week.length }).map((_, i) => (
                          <div
                            key={`pad-${i}`}
                            style={{ width: CELL_SIZE, height: CELL_SIZE }}
                          />
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TooltipProvider>
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
