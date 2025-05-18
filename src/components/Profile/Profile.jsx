import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { UserProfile } from './UserProfile';
import { useGetUsersAllSubmissions } from '@/hooks/apis/getUsersAllSubmission/useGetUsersAllSubmissions';

export const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    console.log('User:', user);

    const [userSubmissionDetails, setUserSubmissionDetails] = useState({});

    const { isLoading, isSuccess, error, getUserAllSubmissionsMutation } = useGetUsersAllSubmissions();

    const fetchUsersAllSubmissions = async () => {
      try {
        const response = await getUserAllSubmissionsMutation();
        console.log('User Submissions:', response);
        setUserSubmissionDetails(response.submissions);
      } catch (error) {
        console.log("error while fetching user submissions", error);
      }
    }

    useEffect(() => {
      if (user) {
        fetchUsersAllSubmissions();
      }
    }, [])
  return (
    <div className='container py-10'>
      <h1 className='text-3xl font-bold mb-8'>Your Profile</h1>
      <UserProfile userSubmissionDetails={userSubmissionDetails} />
    </div>
  );
}
