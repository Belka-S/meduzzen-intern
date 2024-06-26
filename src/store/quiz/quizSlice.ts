import { toast } from 'react-toastify';
import { TCommonResult, TQuiz, TQuizResult } from 'store';
import { initialState, TInitialState } from 'store/quiz';
import * as TNK from 'store/quiz/quizThunks';

import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';

const thunkArr = [
  TNK.addQuestionThunk,
  TNK.createQuizThunk,
  TNK.deleteQuestionThunk,
  TNK.deleteQuizThunk,
  TNK.getQuizThunk,
  TNK.takeQuizThunk,
  TNK.updateQuestionThunk,
  TNK.updateQuizThunk,
];

type TState = 'pending' | 'fulfilled' | 'rejected';
const fn = (state: TState) => thunkArr.map(el => el[state]);

// handlers
const handleResultSuccess = (
  state: TInitialState,
  action: PayloadAction<{
    result: TCommonResult;
    detail: string;
    status_code: number;
  }>,
) => {
  const { result, detail, status_code } = action.payload;
  status_code < 300 ? toast.success(detail) : toast.error(detail);
  state.result = result;
};

const handleGetQuizSuccess = (
  state: TInitialState,
  action: PayloadAction<{ result: TQuiz }>,
) => {
  state.quiz = action.payload.result;
};

const handleTakeQuizSuccess = (
  state: TInitialState,
  action: PayloadAction<{ result: TQuizResult; status_code: number }>,
) => {
  const { result, status_code } = action.payload;
  status_code < 300
    ? toast.success(`Success. Quiz result: ${result.result_score}%`)
    : toast.error(status_code);
  state.result = result;
};

// slice
const quizSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // quiz success
      .addCase(TNK.createQuizThunk.fulfilled, handleResultSuccess)
      .addCase(TNK.getQuizThunk.fulfilled, handleGetQuizSuccess)
      .addCase(TNK.deleteQuizThunk.fulfilled, handleResultSuccess)
      .addCase(TNK.updateQuizThunk.fulfilled, handleResultSuccess)
      .addCase(TNK.takeQuizThunk.fulfilled, handleTakeQuizSuccess)
      // question success
      .addCase(TNK.addQuestionThunk.fulfilled, handleResultSuccess)
      .addCase(TNK.updateQuestionThunk.fulfilled, handleResultSuccess)
      .addCase(TNK.deleteQuestionThunk.fulfilled, handleResultSuccess)
      // loading, error
      .addMatcher(isAnyOf(...fn('pending')), state => {
        return { ...state, loading: true, error: false };
      })
      .addMatcher(isAnyOf(...fn('fulfilled')), state => {
        return { ...state, loading: false, error: false };
      })
      .addMatcher(isAnyOf(...fn('rejected')), (state, action) => {
        return { ...state, loading: false, error: action.payload };
      });
  },
});

export const quizReducer = quizSlice.reducer;

// export const {} = quizSlice.actions;
