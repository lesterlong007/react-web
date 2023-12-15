import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { request } from 'src/util//network/request';

const Index: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getData = async () => {
    const { data, error } = await request('/api/user-info', { a: 1 }, 'POST');
    console.log(data, error);
  };

  return (
    <div className="test-word" style={{ margin: 10 }}>
      <div onClick={() => navigate('/mine')}>Welcome to my home page</div>
      <div>{t('title')}</div>
      <img
        src="/static/google_logo.jpeg"
        alt=""
        style={{ width: '100px' }}
        onClick={() => {
          getData();
        }}
      />
    </div>
  );
};

export default Index;
