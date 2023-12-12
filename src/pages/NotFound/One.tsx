import React, { useContext } from 'react';
import { ContextWrite } from 'src/store';

const One: React.FC = () => {
  const dispatch = useContext(ContextWrite);

  console.log(dispatch, 'One');

  return (
    <div onClick={() => dispatch({ name: 'lester' })}>
       One
    </div>
  );
};

export default One;
