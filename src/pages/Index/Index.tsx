import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="test-word" style={{ margin: 10 }} onClick={() => navigate('/mine')}>
      Welcome to my home page
    </div>
  );
};

export default Index;
