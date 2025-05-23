import ProblemForm from '@/components/ProblemForm/ProblemForm'
import { useGetIndividualProblem } from '@/hooks/apis/getIndividualProblem/useGetIndividualProblem';
import React, { useEffect } from 'react'


export const UpdateProblemPage = () => {
  const problemId = window.location.pathname.split('/').pop();
  const {isLoading, isSuccess, error, getIndividualProblemMutation} = useGetIndividualProblem(problemId);

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
    <div><ProblemForm mode={"update"} problemInfo={problemInfo}/></div>
  )
}
