import React, { PropsWithChildren } from 'react';

interface ButtonProps extends PropsWithChildren {
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return <div onClick={onClick}>{children || 'Button'}</div>;
};

export default Button;
