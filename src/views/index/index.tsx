import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@common/components';
import { post } from '@common/network/request';
import { usePage } from '@common/components/page/page';
import { getUrlParams, useNavigation } from '@common/hooks/navigation';

const Index: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const { setTitle, setClassName, setDesktopModel } = usePage();
  const { t } = useTranslation();
  const navigate = useNavigation();

  const getData = async () => {
    const { data, error } = await post('/api/user-info', { a: 1 });
    console.log(data, error);
  };

  const getDataTwo = async () => {
    const { data, error } = await post('/api/list', { b: 2 });
    console.log(data, error);
  };

  const getDataThree = async () => {
    const { data, error } = await post('/api/detail', { c: 3 });
    console.log(data, error);
  };

  const getDataFour = async () => {
    const { data, error } = await post('/api/more-info', { d: 4 });
    console.log(data, error);
  };

  const showCount = () => {
    console.log(count, 111);
    setCount(count + 1);
    setTimeout(() => {
      console.log(count, 222);
    }, 1000);
  };

  useEffect(() => {
    setTitle?.('Pru service index page');
    // setClassName?.('bg-b-2');
    setDesktopModel?.('small');
  }, []);

  return (
    <div className="mt-12 bg-b-1 rounded-[16px] py-24 px-16">
      <div className="pre-28bold pre-28bold-i !w-full tablet:pre-28bold" onClick={showCount}>
        Count plus
      </div>
      <Icon name="user" size={28} />
      <Icon color="var(--warning-1)" name="user" />
      <Icon color="var(--t-highlight)" name="user" size={50} />
      <div className="w-full flex flex-col">
        <h3 className="mt-24">Common</h3>
        <Button
          className="w-[300px]"
          onClick={() => {
            navigate('/common/demo');
          }}
        >
          Go common demo page
        </Button>
        <h3 className="mt-24">Partial Withdrawal</h3>
        <Button
          className="mt-12"
          onClick={() => {
            navigate('/alteration/partial-withdrawal/policy-list');
          }}
        >
          Go to partial withdrawal list
        </Button>
        <Button
          className="mt-12"
          onClick={() => {
            navigate(
              '/alteration/partial-withdrawal/detail?policyId=VEh%2BflBMVH5%2BUG9saWN5fn4yMDAyNTY1Mw__'
            );
          }}
        >
          Go to partial withdrawal detail page
        </Button>
        <Button
          className="mt-12"
          onClick={() => {
            navigate(
              '/alteration/partial-withdrawal/success?status=success&lifeAssured=joy&amount=900&transactionId=123456&serviceType=fundSwitch&paymentMethodId=53&&policyId=TVl%2BflBBTUJ%2BflBvbGljeX5%2BMDA3Njc1Mjd%2BfjgzMDgwMzExMDgwMw__&policyNo=MDA3Njc1Mjc_'
            );
          }}
        >
          Partial withdrawal result page
        </Button>
        <Button
          className="mt-12"
          onClick={() => {
            navigate(
              '/overview/transaction-detail/partial-withdrawal?policyId=VEh%2BflBMVH5%2BUG9saWN5fn4yMDAyNTY1Mw__&transactionId=123456'
            );
          }}
        >
          Partial withdrawal transaction detail page
        </Button>
        <h3 className="mt-24">Fund Switch</h3>
        <Button
          className="mt-12"
          onClick={() => {
            navigate(
              '/investment/fund-switch/detail?policyId=VEh%2BflBMVH5%2BUG9saWN5fn4yMDAyNTY1Mw__'
            );
          }}
        >
          Go to fund switch detail page
        </Button>
        <Button
          className="mt-12"
          onClick={() => {
            navigate('/investment/fund-switch/list');
          }}
        >
          Fund switch list page
        </Button>
        <Button
          className="mt-12"
          onClick={() => {
            navigate(
              '/investment/fund-switch/success?status=success&lifeAssured=joy&amount=900&transactionId=123456&serviceType=fundSwitch&paymentMethodId=53&&policyId=TVl%2BflBBTUJ%2BflBvbGljeX5%2BMDA3Njc1Mjd%2BfjgzMDgwMzExMDgwMw__&policyNo=MDA3Njc1Mjc_'
            );
          }}
        >
          Fund switch result page
        </Button>
        <Button
          className="mt-12"
          onClick={() => {
            navigate(
              '/overview/transaction-detail/fund-switch?policyId=VEh%2BflBMVH5%2BUG9saWN5fn4yMDAyNTY1Mw__&transactionId=123456'
            );
          }}
        >
          Fund switch transaction detail page
        </Button>
        <h3 className="mt-24">Premium Redirection</h3>
        <Button
          className="mt-12"
          onClick={() => {
            navigate('/investment/premium-redirection/list');
          }}
        >
          Premium Redirection list page
        </Button>
        <Button
          className="mt-12"
          onClick={() => {
            navigate(
              '/investment/premium-redirection/detail?policyId=VEh%2BflBMVH5%2BUG9saWN5fn4yMDAyNTY1Mw__'
            );
          }}
        >
          Premium Redirection detail page
        </Button>
        <Button
          className="mt-12"
          onClick={() => {
            navigate(
              '/investment/premium-redirection/success?status=success&lifeAssured=joy&amount=900&transactionId=123456&serviceType=fundSwitch&paymentMethodId=53&&policyId=TVl%2BflBBTUJ%2BflBvbGljeX5%2BMDA3Njc1Mjd%2BfjgzMDgwMzExMDgwMw__&policyNo=MDA3Njc1Mjc_'
            );
          }}
        >
          Premium Redirection result page
        </Button>
        <Button
          className="mt-12"
          onClick={() => {
            navigate(
              '/overview/transaction-detail/premium-redirection?policyId=VEh%2BflBMVH5%2BUG9saWN5fn4yMDAyNTY1Mw__&transactionId=123456'
            );
          }}
        >
          Premium Redirection transaction detail page
        </Button>
      </div>
    </div>
  );
};

export default Index;
