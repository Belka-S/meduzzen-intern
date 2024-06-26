import { MouseEvent, ReactElement, RefObject } from 'react';

export type TButtonProps = {
  className?: string;
  size?: 's' | 'm' | 'l';
  width?: 'full' | 'round' | number;
  type?: 'button' | 'submit' | 'reset';
  color?: 'default' | 'outlined' | 'transparent' | 'disabled';
  variant?: 'orthogonal' | 'smooth' | 'round';
  label?: string;
  ref?: RefObject<HTMLButtonElement>;
  id?: string;

  href?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  onMouseOver?: (e: MouseEvent<HTMLButtonElement>) => void;
  children?: ReactElement;
};
