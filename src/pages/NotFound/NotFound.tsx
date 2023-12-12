import React from 'react';
import classNames from 'classnames';
import style from './style.module.scss';

const NotFound: React.FC = () => {

  return (
    <div className={classNames('hide-scrollbar', style.wrapper)}>
       404 Not Found
    </div>
  );
};

export default NotFound;
