import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { UserProfile } from './UserProfile';
import { useGetUsersAllSubmissions } from '@/hooks/apis/getUsersAllSubmission/useGetUsersAllSubmissions';
import { useGetUserDetails } from '@/hooks/apis/auth/useGetUserDetails';

export const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    console.log('User:', user);

    const [usersDetails, setUsersDetails] = useState({});

    const [userSubmissionDetails, setUserSubmissionDetails] = useState({});

    const [userProblemStats, setUserProblemStats] = useState({});

    const { isLoading, isSuccess, error, getUserAllSubmissionsMutation } = useGetUsersAllSubmissions();

    const {
      isLoading: isLoadingUser,
      isSuccess: isSuccessUser,
      error: errorUser,
       getUserDetailsMutation,
    } = useGetUserDetails();

    const fetchUsersAllSubmissions = async () => {
      try {
        const response = await getUserAllSubmissionsMutation();
        console.log('User Submissions:', response);
        setUserSubmissionDetails(response?.submissions);
        setUserProblemStats(response?.stats);
      } catch (error) {
        console.log("error while fetching user submissions", error);
      }
    }

    const fetchUserDetails = async () => {
      try {
        const response = await getUserDetailsMutation();
        console.log('User Details:', response);
        setUsersDetails(response?.user);
      } catch (error) {
        console.log("error while fetching user details", error);
      }
    }

    useEffect(() => {
      if (user) {
        fetchUsersAllSubmissions();
        fetchUserDetails();
      }
    }, [])
  return (
    <div className='container py-10'>
      <h1 className='text-3xl font-bold mb-8'>Your Profile</h1>
      <UserProfile
        userSubmissionDetails={userSubmissionDetails}
        usersDetails={usersDetails}
        userProblemStats={userProblemStats}
      />
    </div>
  );
}
