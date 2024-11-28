import React, {
  Context,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import { getUrlParams } from '@common/hooks/navigation';
import { pruSessionStore } from '@common/util/storage';
import { get } from '@common/network/request';

interface PolicyDetailClient {
  id: string;
  clientId: string;
  type: string;
  firstName: string;
  surName: string;
  dob: string;
  sex: string;
  [key: string]: any;
}

interface PolicyDetail {
  id: string;
  policyNo: string;
  lapsedDate: string;
  policyTypeDesc: string;
  clients: PolicyDetailClient[];
  [key: string]: any;
}

const PolicyDetailWrite: Context<{
  getPolicyDetail?: (options: { policyId?: string; preferCache?: boolean }) => Promise<any>;
}> = createContext({});
const PolicyDetailContext: Context<{ policyDetail?: PolicyDetail; loading?: boolean }> =
  createContext({});

let isFetching = false;

export const usePolicyDetail = (options?: { policyId?: string; preferCache?: boolean }) => {
  const { policyId, preferCache = true } = options || {};
  const { getPolicyDetail } = useContext(PolicyDetailWrite);
  useEffect(() => {
    getPolicyDetail?.({ policyId, preferCache });
  }, [policyId, preferCache]);
  return useContext(PolicyDetailContext);
};

const PolicyDetailProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [policyDetail, setPolicyDetail] = useState<PolicyDetail>({} as PolicyDetail);
  const [loading, setLoading] = useState(false);

  const getPolicyDetail = async (options?: {
    policyId?: string;
    preferCache?: boolean;
  }): Promise<any> => {
    const { policyId: policyIdParam, preferCache = true } = options || {};
    const { policyId: policyIdUrl } = getUrlParams();
    const policyId = policyIdParam || policyIdUrl;
    const cacheKey = `policyDetailData-${policyId}`;
    const cachedData = pruSessionStore.getItem(cacheKey);
    if (isFetching) {
      return cachedData || policyDetail;
    }
    if (!policyId) {
      console.error('policyId is required!');
    } else if (preferCache && cachedData) {
      setPolicyDetail(cachedData);
      return cachedData;
    } else {
      setLoading(true);
      isFetching = true;
      const { error, data } = await get(`/insurance-policy/policies/${policyId}/details`);
      setLoading(false);
      isFetching = false;
      const policyDetailData = data?.body;
      setPolicyDetail(policyDetailData);
      pruSessionStore.setItem(cacheKey, data?.body);
      return policyDetailData;
    }
  };

  return (
    <PolicyDetailWrite.Provider value={{ getPolicyDetail }}>
      <PolicyDetailContext.Provider value={{ policyDetail, loading }}>
        {children}
      </PolicyDetailContext.Provider>
    </PolicyDetailWrite.Provider>
  );
};

export default PolicyDetailProvider;
