import React from 'react';
import classNames from 'classnames';
import One from './One';
import Two from './Two';
import Three from './Three';
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
