import ProblemForm from '@/components/ProblemForm/ProblemForm'
import { useGetIndividualProblem } from '@/hooks/apis/getIndividualProblem/useGetIndividualProblem';
import React, { useEffect } from 'react'
import { SkeletonCard } from '../SkeletonPage/SkeletonCard';


export const UpdateProblemPage = () => {
  const problemId = window.location.pathname.split('/').pop();
  const {isLoading, isSuccess, error, getIndividualProblemMutation} = useGetIndividualProblem(problemId);

  console.log("isSuccess", isSuccess);

  const [problemInfo, setProblemInfo] = React.useState({});
  const getProblemDetails = async () => {
    try {
      const response = await getIndividualProblemMutation(problemId);
      console.log('Successfully fetched individual problem', response);
      setProblemInfo(response.problem);
    } catch (error) {
      console.error('Error fetching individual problem', error);
    }
  }

  useEffect(() => {
    getProblemDetails();
  }, [problemId]);
  
  return (
    <div>
      {!isSuccess ? (
        <div className='flex justify-center items-center h-screen'>
          <SkeletonCard/>
        </div>
      ) : (
        <ProblemForm
          mode={'update'}
          problemInfo={problemInfo}
          isSuccessProblemInfo={isSuccess}
        />
      )}
    </div>
  );
  
}
