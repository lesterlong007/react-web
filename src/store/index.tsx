import React, { createContext, useState, Context as ContextProps, PropsWithChildren, Dispatch, SetStateAction } from 'react';

interface UserInfo {
  name?: string;
  lastName?: string;
}

type SetUserInfo = Dispatch<SetStateAction<UserInfo>>;

export const ContextRead: ContextProps<UserInfo> = createContext({});

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const ContextWrite: ContextProps<SetUserInfo> = createContext((() => {}) as SetUserInfo);

const StoreContext: React.FC<PropsWithChildren> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({});

  return (
    <ContextWrite.Provider value={setUserInfo}>
      <ContextRead.Provider value={userInfo}>{children}</ContextRead.Provider>
    </ContextWrite.Provider>
  );
};

export default StoreContext;
