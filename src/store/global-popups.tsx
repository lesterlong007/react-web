import React, {
  createContext,
  useState,
  Context as ContextProps,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef
} from 'react';
import InAppSurvey, { ShowSurveyOption } from '@common/biz-components/app-survey/in-app-survey';

const GlobalPopupContext: ContextProps<{
  showAppSurvey: (args: ShowSurveyOption) => void;
}> = createContext({
  showAppSurvey: (args) => {}
});

export const useGlobalPopup = () => useContext(GlobalPopupContext);

const GlobalPopupProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const surveyRef = useRef<{ showSurvey?: (args: ShowSurveyOption) => void }>({});
  const showAppSurvey = (args: ShowSurveyOption) => {
    surveyRef.current?.showSurvey?.(args);
  };

  useEffect(() => {}, []);

  return (
    <GlobalPopupContext.Provider value={{ showAppSurvey }}>
      {children}
      <InAppSurvey ref={surveyRef} />
    </GlobalPopupContext.Provider>
  );
};

export default GlobalPopupProvider;
