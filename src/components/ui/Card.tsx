import React from 'react';
import { ICardComponent } from './interfaces/IComponent';

// Single Responsibility Principle - Card component only handles card layout
export class BaseCard implements ICardComponent {
  title?: string;
  footer?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;

  constructor(props: ICardComponent) {
    this.title = props.title;
    this.footer = props.footer;
    this.className = props.className;
    this.children = props.children;
  }

  getBaseClasses(): string {
    return 'card max-w-md mx-auto';
  }

  getCombinedClasses(): string {
    return `${this.getBaseClasses()} ${this.className || ''}`;
  }
}

const Card: React.FC<ICardComponent> = (props) => {
  const cardInstance = new BaseCard(props);
  
  return (
    <div className={cardInstance.getCombinedClasses()}>
      {cardInstance.title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center text-white">
            {cardInstance.title}
          </h2>
        </div>
      )}
      
      <div className="space-y-4">
        {cardInstance.children}
      </div>
      
      {cardInstance.footer && (
        <div className="mt-6">
          {cardInstance.footer}
        </div>
      )}
    </div>
  );
};

export default Card;