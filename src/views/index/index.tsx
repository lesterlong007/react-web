import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components';
import { post } from 'src/util/network/request';

/**
 * if need to SSR
 */
export const getServiceSideProps = async () => {
  // fetch data
};

const Index: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  return (
    <div className="test-word mt-12">
      <div className="my-2 pre-20bold font-bold" onClick={() => navigate('/mine')}>
        Welcome to my home page
      </div>
      <div>{t('title')}</div>
      <Button />
      <img
        src="/static/google_logo.jpeg"
        alt=""
        style={{ width: '100px' }}
        onClick={() => {
          getData();
          setTimeout(() => {
            getDataTwo();
          }, 100);
          setTimeout(() => {
            getDataThree();
          }, 200);

          setTimeout(() => {
            getDataFour();
          }, 700);
        }}
      />
    </div>
  );
};

export default Index;
