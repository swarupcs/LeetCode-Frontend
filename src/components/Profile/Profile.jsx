import React from 'react'
import { useSelector } from 'react-redux';

export const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    console.log('User:', user);
  return (
    <div>Profile</div>
  )
}
