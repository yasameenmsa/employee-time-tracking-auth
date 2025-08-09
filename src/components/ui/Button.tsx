import React from 'react';
import { IButtonComponent } from './interfaces/IComponent';

// Single Responsibility Principle - Button component only handles button rendering
// Open/Closed Principle - Extensible through variants without modification
export class BaseButton implements IButtonComponent {
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  children?: React.ReactNode;

  constructor(props: IButtonComponent) {
    this.onClick = props.onClick;
    this.variant = props.variant || 'primary';
    this.loading = props.loading;
    this.className = props.className;
    this.disabled = props.disabled;
    this.required = props.required;
    this.children = props.children;
  }

  getVariantClasses(): string {
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      danger: 'bg-red-600 text-white hover:bg-red-700'
    };
    return variants[this.variant!];
  }

  getBaseClasses(): string {
    return 'w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  }

  getCombinedClasses(): string {
    return `${this.getBaseClasses()} ${this.getVariantClasses()} ${this.className || ''}`;
  }

  isDisabled(): boolean {
    return this.disabled || this.loading || false;
  }
}

const Button: React.FC<IButtonComponent> = (props) => {
  const buttonInstance = new BaseButton(props);
  
  return (
    <button
      type="submit"
      onClick={buttonInstance.onClick}
      className={buttonInstance.getCombinedClasses()}
      disabled={buttonInstance.isDisabled()}
    >
      {buttonInstance.loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>جاري التحميل...</span>
        </div>
      ) : (
        buttonInstance.children
      )}
    </button>
  );
};

export default Button;