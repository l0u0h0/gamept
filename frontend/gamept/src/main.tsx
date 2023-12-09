// import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import CreateGamePage from './pages/CreateGamePage.tsx';
import SinglePlayPage from './pages/SinglePlayPage.tsx'; // 새로 만든 페이지 컴포넌트를 불러옵니다.
import CreateCharacterPage from './pages/CreateCharacterPage.tsx';
import MultiPlayPage from './pages/MultiPlayPage.tsx';
import EndingPage from './pages/EndingPage.tsx';
import { QueryClientProvider, QueryClient } from 'react-query';
import { initDB } from 'react-indexed-db-hook';
import { DBConfig } from './services/DBConfig.ts';

// 라우팅 경로 지정
const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/createGame', element: <CreateGamePage /> },
  { path: '/singleplay', element: <SinglePlayPage /> }, // 새로운 경로 추가
  { path: '/createCharacter', element: <CreateCharacterPage /> }, // 새로운 경로 추가
  { path: '/multiplay', element: <MultiPlayPage /> },
  { path: '/ending', element: <EndingPage /> },
]);

//react query 설정파일
const queryClient = new QueryClient();
// indexedDB 사용 선언
initDB(DBConfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  // </React.StrictMode>
);
