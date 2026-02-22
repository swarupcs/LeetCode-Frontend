// Mock analytics data for the admin dashboard

export interface AnalyticsDay {
  rawDate: Date;
  date: string;
  signups: number;
  active: number;
  accepted: number;
  rejected: number;
}

function generateAnalyticsData(days: number): AnalyticsDay[] {
  const data: AnalyticsDay[] = [];
  const now = new Date();
  // Use a seeded-ish approach: base on day-of-year for stability within a session
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const dayOfYear = Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
        86400000,
    );
    const pseudo = Math.abs(Math.sin(dayOfYear * 12.9898) * 43758.5453) % 1;
    const pseudo2 = Math.abs(Math.sin(dayOfYear * 78.233) * 43758.5453) % 1;

    const isWeekend = [0, 6].includes(date.getDay());
    const trend = Math.floor((days - i) / (days / 4));

    // Signups
    const signupBase = 3 + Math.floor(pseudo * 5);
    const signups = Math.max(1, signupBase + (isWeekend ? -2 : 0) + trend);

    // Active users
    const activeBase = 18 + Math.floor(pseudo2 * 12);
    const active = Math.max(5, activeBase + (isWeekend ? -6 : 0) + trend);

    // Submissions
    const total = 30 + Math.floor(pseudo * 25);
    const acceptRate = 0.55 + pseudo2 * 0.2;
    const accepted = Math.round(total * acceptRate * (isWeekend ? 0.6 : 1));
    const rejected = Math.round(
      total * (1 - acceptRate) * (isWeekend ? 0.6 : 1),
    );

    data.push({
      rawDate: date,
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      signups,
      active,
      accepted,
      rejected,
    });
  }
  return data;
}

// Generate 90 days of data for flexible range filtering
export const allAnalyticsData = generateAnalyticsData(90);

export function filterByDateRange(
  data: AnalyticsDay[],
  from: Date | undefined,
  to: Date | undefined,
): AnalyticsDay[] {
  if (!from && !to) return data;
  return data.filter((d) => {
    if (from && d.rawDate < from) return false;
    if (to) {
      const endOfDay = new Date(to);
      endOfDay.setHours(23, 59, 59, 999);
      if (d.rawDate > endOfDay) return false;
    }
    return true;
  });
}

export function computeSummary(data: AnalyticsDay[]) {
  const totalSignups = data.reduce((s, d) => s + d.signups, 0);
  const avgActive =
    data.length > 0
      ? Math.round(data.reduce((s, d) => s + d.active, 0) / data.length)
      : 0;
  const totalAccepted = data.reduce((s, d) => s + d.accepted, 0);
  const totalRejected = data.reduce((s, d) => s + d.rejected, 0);
  const totalSubmissions = totalAccepted + totalRejected;
  const acceptanceRate =
    totalSubmissions > 0
      ? Math.round((totalAccepted / totalSubmissions) * 100)
      : 0;

  return {
    totalUsers: 847,
    newUsersInRange: totalSignups,
    avgDailyActive: avgActive,
    totalSubmissions,
    acceptanceRate,
    userGrowthPct: 12.4,
    days: data.length,
  };
}
