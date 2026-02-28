// src/hooks/redux.ts
import type { AppDispatch, RootState } from '@/app/store';
import { useDispatch, useSelector } from 'react-redux';


// Use these throughout the app instead of plain useDispatch/useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
