import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { request } from 'src/util//network/request';

const Index: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="test-word" style={{ margin: 10 }}>
      <div onClick={() => navigate('/mine')}>Welcome to my home page</div>
      <div>{t('title')}</div>
      <img
        src="/static/google_logo.jpeg"
        alt=""
        style={{ width: '100px' }}
        onClick={() => {
          request('/api/user-info', { a: 1 })
            .then((res: any) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      />
    </div>
  );
};

export default Index;
