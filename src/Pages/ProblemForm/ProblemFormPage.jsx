import React from 'react'
import { CreateProblemPage } from './CreateProblemPage'
import { UpdateProblemPage } from './UpdateProblemPage'

export const ProblemFormPage = ({mode = "update"}) => {
  return (
    <div>
      {mode == 'create' ? (
        <>
          {/* <h1 className='text-3xl font-bold mb-6'>Create New Problem</h1> */}
          <CreateProblemPage mode={mode} />
        </>
      ) : (
        <>
          {/* <h1 className='text-3xl font-bold mb-6'>Update Problem</h1> */}
          <UpdateProblemPage mode={mode} />
        </>
      )}
    </div>
  );
}
