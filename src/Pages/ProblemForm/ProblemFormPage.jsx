import React from 'react'
import { CreateProblemPage } from './CreateProblemPage'
import { UpdateProblemPage } from './UpdateProblemPage'
import { useLocation } from 'react-router-dom';

export const ProblemFormPage = ({ mode: defaultMode = "update" }) => {
    const location = useLocation();
    const mode = location.state?.mode || defaultMode;
  return (
    <div>
      {mode === 'create' ? (
        <>
          <CreateProblemPage mode={mode} />
        </>
      ) : (
        <>
          <UpdateProblemPage mode={mode} />
        </>
      )}
    </div>
  );
}
