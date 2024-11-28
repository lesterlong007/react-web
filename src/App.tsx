import React, { Suspense } from 'react';
import { Routes, Route, RouteProps, BrowserRouter as Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import PageProvider from '@common/components/page/page';
import ToastProvider from '@common/components/toast/toast';
import AlertProvider from '@common/components/alert/alert';
import i18n from './util/i18n';
import UserProvider from './store/user-account';
import GlobalPopupProvider from './store/global-popups';
import PolicyDetailProvider from './store/policy-detail';
import { routes } from './route';
import { initDayjs } from './util/dayjs';

initDayjs();

const App: React.FC = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <Router basename={process.env.BASENAME}>
        <AlertProvider>
          <ToastProvider>
            <UserProvider>
              <PolicyDetailProvider>
                <GlobalPopupProvider>
                  <PageProvider>
                    <Suspense fallback="">
                      <Routes>
                        {routes.map(({ path, ...props }: RouteProps) => (
                          <Route key={`rt${path}`} path={path} {...props} />
                        ))}
                      </Routes>
                    </Suspense>
                  </PageProvider>
                </GlobalPopupProvider>
              </PolicyDetailProvider>
            </UserProvider>
          </ToastProvider>
        </AlertProvider>
      </Router>
    </I18nextProvider>
  );
};

export default App;
