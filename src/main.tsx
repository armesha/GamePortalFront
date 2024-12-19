import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.scss';
import { routeTree } from './routeTree.gen';

const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultPreloadDelay: 100,
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>,
);
