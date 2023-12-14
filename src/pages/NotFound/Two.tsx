import React, { useContext } from 'react';
import { ContextRead } from 'src/store';
import Four from './Four';

const Two: React.FC = () => {
  const useInfo = useContext(ContextRead);

  console.log('two', useInfo);

  return (
    <div>
      two
      <Four />
    </div>
  );
};

export default Two;
