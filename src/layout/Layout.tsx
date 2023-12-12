import React, { Suspense } from 'react';
import { Routes, Route, RouteProps } from 'react-router-dom';
import { routes } from 'src/pages/route';

const Layout: React.FC = () => {
  
  return (
    <Suspense fallback="...">
      <Routes>
        {routes.map(({ path, ...props }: RouteProps) => (
          <Route key={`rt${path}`} path={path} {...props} />
        ))}
      </Routes>
    </Suspense>
  );
};

export default Layout;
