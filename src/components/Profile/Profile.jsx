import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { UserProfile } from './UserProfile';
import { useGetUsersAllSubmissions } from '@/hooks/apis/getUsersAllSubmission/useGetUsersAllSubmissions';
import { useGetUserDetails } from '@/hooks/apis/auth/useGetUserDetails';

export const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    console.log('User:', user);

    const [userSubmissionDetails, setUserSubmissionDetails] = useState({});

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
        setUserSubmissionDetails(response.submissions);
      } catch (error) {
        console.log("error while fetching user submissions", error);
      }
    }

    const fetchUserDetails = async () => {
      try {
        const response = await getUserDetailsMutation();
        console.log('User Details:', response);
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
      <UserProfile userSubmissionDetails={userSubmissionDetails} />
    </div>
  );
}
