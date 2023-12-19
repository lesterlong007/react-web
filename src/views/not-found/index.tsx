import React from 'react';
import classNames from 'classnames';
import One from './one';
import Two from './two';
import Three from './three';
import style from './style.module.scss';

const NotFound: React.FC = () => {
  return (
    <div className={classNames('hide-scrollbar', style.wrapper)}>
      404 Not Found
      <One />
      <Two />
      <Three />
    </div>
  );
};

export default NotFound;
