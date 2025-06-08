
import { useState, useMemo, useEffect } from "react"
import { Search, Trophy, Medal, Award } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetLeaderBoardData } from "@/hooks/apis/leaderboard/useGetLeaderBoardData"
import { useSelector } from "react-redux"


const LeaderboardSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-full max-w-sm" />
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead className="hidden sm:table-cell">Username</TableHead>
            <TableHead className="text-right">Problems Solved</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 6 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-6 w-8" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-32" />
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Skeleton className="h-6 w-24" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-6 w-12 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
)

const getRankIcon = (rank) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />
    default:
      return null
  }
}

const getRankBadge = (rank) => {
  switch (rank) {
    case 1:
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
          🥇 1st
        </Badge>
      )
    case 2:
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-300">
          🥈 2nd
        </Badge>
      )
    case 3:
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-300">
          🥉 3rd
        </Badge>
      )
    default:
      return <span className="font-semibold text-muted-foreground">#{rank}</span>
  }
}

export default function Leaderboard() {
  const [searchTerm, setSearchTerm] = useState("")

  const [leaderboardDetails, setLeaderboardDetails] = useState(null);


  const auth = useSelector((state) => state.auth);

    const currentUsername = auth.username;


  const { isPending, isSuccess, error, leaderBoardData } =
    useGetLeaderBoardData();

  useEffect(() => {
    console.log('Leaderboard data fetched:', leaderBoardData);
    setLeaderboardDetails(leaderBoardData?.data);
  }, [leaderBoardData]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return leaderboardDetails

    return leaderboardDetails.filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [leaderboardDetails, searchTerm])



  console.log("ispending", isPending);

  return (
    <>
      {isPending ? (
        <LeaderboardSkeleton />
      ) : (
        <Card className='w-full max-w-4xl mx-auto'>
          <CardHeader>
            <CardTitle className='text-2xl font-bold text-center flex items-center justify-center gap-2'>
              <Trophy className='h-6 w-6 text-yellow-500' />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Search Filter */}
            <div className='relative max-w-sm'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
              <Input
                placeholder='Search by name or username...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>

            {/* Leaderboard Table */}
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-16'>Rank</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead className='hidden sm:table-cell'>
                      Username
                    </TableHead>
                    <TableHead className='text-right'>
                      Problems Solved
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className='text-center py-8 text-muted-foreground'
                      >
                        {searchTerm
                          ? 'No users found matching your search.'
                          : 'No data available.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData?.map((user) => {
                      const isCurrentUser = user.username === currentUsername;

                      return (
                        <TableRow
                          key={user.username}
                          className={`${
                            isCurrentUser
                              ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800'
                              : ''
                          } hover:bg-muted/50 transition-colors`}
                        >
                          <TableCell className='font-medium'>
                            <div className='flex items-center gap-2'>
                              {getRankIcon(user.rank)}
                              {getRankBadge(user.rank)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='flex flex-col'>
                              <div className='flex items-center gap-2'>
                                <span className='font-medium'>
                                  {user.fullName}
                                </span>
                                {isCurrentUser && (
                                  <Badge
                                    variant='outline'
                                    className='text-xs bg-blue-100 text-blue-800 border-blue-300'
                                  >
                                    You
                                  </Badge>
                                )}
                              </div>
                              {/* Show username on mobile when hidden in separate column */}
                              <span className='text-sm text-muted-foreground sm:hidden'>
                                @{user.username}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className='hidden sm:table-cell text-muted-foreground'>
                            @{user.username}
                          </TableCell>
                          <TableCell className='text-right'>
                            <div className='flex items-center justify-end gap-1'>
                              <span className='font-semibold text-lg'>
                                {user.problemsSolved}
                              </span>
                              <span className='text-sm text-muted-foreground'>
                                solved
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Stats Summary */}
            {filteredData?.length > 0 && (
              <div className='flex flex-wrap gap-4 pt-4 border-t'>
                <div className='text-sm text-muted-foreground'>
                  <span className='font-medium'>{filteredData.length}</span>{' '}
                  users shown
                </div>
                <div className='text-sm text-muted-foreground'>
                  Top performer:{' '}
                  <span className='font-medium'>
                    {filteredData[0]?.fullName}
                  </span>{' '}
                  with{' '}
                  <span className='font-medium'>
                    {filteredData[0]?.problemsSolved}
                  </span>{' '}
                  problems solved
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
