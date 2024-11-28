import React from 'react';

interface TestProps {
  name: string;
}

const Test: React.FC<TestProps> = () => {
  return <div>my content</div>;
};

export default Test;
