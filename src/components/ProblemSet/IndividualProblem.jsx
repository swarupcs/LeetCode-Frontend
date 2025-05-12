import { useGetIndividualProblem } from '@/hooks/apis/getIndividualProblem/useGetIndividualProblem';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';

export const IndividualProblem = () => {

  const { isLoading, isSuccess, error, getIndividualProblemMutation } = useGetIndividualProblem();

  const problemId = useParams().problemId ;
  console.log('Problem ID:', problemId);

  const getIndividualProblem = async (problemId) => {
    try {
      const response = await getIndividualProblemMutation(problemId);
      console.log('Individual Problem:', response);
    } catch (error) {
      console.error('Error fetching individual problem:', error);
    }
  }

  useEffect(() => {
    getIndividualProblem(problemId);
  }, []);
  return (
    <>
    
    
    </>
  )
}
