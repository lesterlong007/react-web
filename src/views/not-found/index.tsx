import React from 'react';
import classNames from 'classnames';
import { Button, EmptyView } from '@common/components';

const NotFound: React.FC = () => {
  return (
    <EmptyView titleClass="pre-24bold-im !text-t-1" title="Page Unavailable">
      <p className="pre-15semi text-t-2 mt-12">
        This page is currently unavailable. You may go back and visit other pages.
      </p>
      <p className="pre-12semi text-t-3 mt-12">Error code: 404</p>
      <Button className="my-24 w-[200px]" type="secondary" onClick={() => window.location.reload()}>
        Try again
      </Button>
    </EmptyView>
  );
};

export default NotFound;
