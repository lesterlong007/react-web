import React, { useEffect } from 'react';
import { pxTransformToRem } from 'src/util/base';
import classNames from 'classnames';
import style from './style.module.scss';

const Mine: React.FC = () => {
  useEffect(() => {
    console.log('Mine mounted');
  }, []);

  return (
    <div className={classNames('hide-scrollbar', style.wrapper)} style={{ marginTop: pxTransformToRem(10) }}>
      My Info
    </div>
  );
};

export default Mine;
