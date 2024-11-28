import React, {
  createContext,
  useState,
  Context as ContextProps,
  PropsWithChildren,
  useContext,
  useEffect
} from 'react';
import { useTranslation } from 'react-i18next';
import { get, post } from '@common/network/request';
import { useAlert } from '@common/components/alert/alert';
import { setUserProps } from '@common/util/event-track/event-tracking';
import { toWebPage } from '@common/hooks/navigation';
import { clearAllStorage } from '@common/util/storage';
import { getLocation } from '@common/util/env';
import apiConfig from './account-api/config';

const { userInfo: useInfoApi, logout, profile } = apiConfig;

interface UserInfo {
  loginInfo: {
    sub?: string;
    service_account?: string;
    region?: string;
    pruservice_verified?: boolean;
    masked_psweb_legacy_phone?: string;
    masked_psweb_legacy_email?: string;
    auth_level?: number;
  };
  profileInfo: {
    email: string;
    phone: string;
  };
}

interface ExtraParam {
  autoRedirect?: boolean;
  needToast?: boolean;
}

type SignOutHandler = (fn: () => void) => void;

interface UserInfoDispatch {
  getProfileInfo?: () => Promise<Response>;
  getUserInfo?: (extraParam?: ExtraParam) => Promise<UserInfo['loginInfo']>;
  beforeSignOut?: (fn: SignOutHandler) => void;
  signOut?: (option?: { immediate?: boolean }) => void;
}

const UserInfoContext: ContextProps<UserInfo> = createContext({} as any);

// eslint-disable-next-line @typescript-eslint/no-empty-function
const UserInfoWrite: ContextProps<UserInfoDispatch> = createContext({});

export const useUserInfo = () => useContext(UserInfoContext);

export const useUserAccount = () => useContext(UserInfoWrite);

const signOutHandlers: SignOutHandler[] = [];

const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);

  const { t } = useTranslation();
  const { showAlert } = useAlert();

  const doSignOut = () => {
    post(logout, {}).then(() => {
      clearAllStorage();
      toWebPage('/welcome');
    });
  };

  const getUserInfo = async (extraParam?: ExtraParam) => {
    const option = {
      successCodes: ['PRU_200'],
      autoRedirect: true,
      ...extraParam
    };
    const { data, error } = await get(useInfoApi, {}, option);
    if (!error) {
      setUserInfo({
        ...userInfo,
        loginInfo: data.data
      });
      setUserProps(data.data.sub);
      const accountRegion = data.data.region;
      const location = getLocation();

      if (accountRegion && getLocation() !== accountRegion) {
        showAlert({
          content: t('user_account.switch_tips', {
            accountRegion: t(`user_account.country.${accountRegion}`),
            urlRegion: t(`user_account.country.${location}`)
          }),
          cancelText: t('user_account.switch'),
          confirmText: t('user_account.stay_here'),
          onClose: doSignOut,
          onConfirm: () => {
            window.location.replace(window.location.href.replace(location, accountRegion));
          }
        });
      }
    }
    return data?.data;
  };

  const getProfileInfo = async () => {
    if (!profile) {
      return userInfo.loginInfo || getUserInfo();
    } else if (userInfo.profileInfo) {
      get(profile, {}, { successCodes: [undefined] });
      return userInfo.profileInfo;
    } else {
      const { data } = await get(profile, {}, { successCodes: [undefined] });
      if (data) {
        setUserInfo({
          ...userInfo,
          profileInfo: data
        });
      }
      return data;
    }
  };

  const beforeSignOut = (fn: SignOutHandler) => {
    signOutHandlers.push(fn);
  };

  const signOut = (option?: { immediate?: boolean }) => {
    const { immediate = false } = option || {};
    const callHandlers = (index: number) => {
      const handler = signOutHandlers[index];
      if (signOutHandlers.length > index + 1) {
        handler(() => callHandlers(index + 1));
      } else if (handler) {
        handler(() => doSignOut());
      } else {
        doSignOut();
      }
    };

    if (immediate) {
      doSignOut();
    } else {
      showAlert({
        content: t('user_account.want_sign_out'),
        cancelText: t('user_account.stay'),
        confirmText: t('user_account.sign_out'),
        onConfirm: () => {
          callHandlers(0);
        }
      });
    }
  };

  useEffect(() => {
    getUserInfo({ autoRedirect: false, needToast: false });
  }, []);

  return (
    <UserInfoWrite.Provider value={{ getProfileInfo, getUserInfo, beforeSignOut, signOut }}>
      <UserInfoContext.Provider value={userInfo}>{children}</UserInfoContext.Provider>
    </UserInfoWrite.Provider>
  );
};

export default UserProvider;
