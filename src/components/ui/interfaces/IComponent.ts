// Interface Segregation Principle - Define specific interfaces for different component types
export interface IBaseComponent {
  className?: string;
  children?: React.ReactNode;
}

export interface IFormComponent extends IBaseComponent {
  disabled?: boolean;
  required?: boolean;
}

export interface IInputComponent extends IFormComponent {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
}

export interface IButtonComponent extends IFormComponent {
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

export interface ICardComponent extends IBaseComponent {
  title?: string;
  footer?: React.ReactNode;
}