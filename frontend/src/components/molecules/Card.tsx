import type React from 'react';
import './Card.css';

type CardProps = {
	title: string;
	children: React.ReactNode;
	actions?: React.ReactNode;
	className?: string;
};

export const Card = ({ title, children, actions, className }: CardProps) => {
	return (
		<div className={`card ${className ?? ''}`}>
			<div className="card__header">
				<h2 className="card__title">{title}</h2>
				{actions}
			</div>
			{children}
		</div>
	);
};
