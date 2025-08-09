import React from 'react';
import { IInputComponent } from './interfaces/IComponent';

// Single Responsibility Principle - This component only handles input rendering
// Open/Closed Principle - Can be extended without modification
export class BaseInput implements IInputComponent {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  className?: string;
  disabled?: boolean;
  required?: boolean;

  constructor(props: IInputComponent) {
    this.value = props.value;
    this.onChange = props.onChange;
    this.placeholder = props.placeholder;
    this.type = props.type || 'text';
    this.className = props.className;
    this.disabled = props.disabled;
    this.required = props.required;
  }

  getBaseClasses(): string {
    return 'form-input w-full text-right';
  }

  getCombinedClasses(): string {
    return `${this.getBaseClasses()} ${this.className || ''}`;
  }
}

const Input: React.FC<IInputComponent> = (props) => {
  const inputInstance = new BaseInput(props);
  
  return (
    <input
      type={inputInstance.type}
      value={inputInstance.value}
      onChange={(e) => inputInstance.onChange(e.target.value)}
      placeholder={inputInstance.placeholder}
      className={inputInstance.getCombinedClasses()}
      disabled={inputInstance.disabled}
      required={inputInstance.required}
      dir="rtl"
    />
  );
};

export default Input;