import type React from 'react';
import './Card.css';
import { Link } from 'react-router';

type CardProps = {
	title: string;
	to?: string;
	children: React.ReactNode;
	actions?: React.ReactNode;
	className?: string;
};

export const Card = ({
	title,
	to,
	children,
	actions,
	className,
}: CardProps) => {
	return (
		<div className={`card ${to ? `card--link` : ''} ${className ?? ''}`}>
			<div className="card__header">
				<h2 className="card__title">
					{to ? <Link to={to}>{title}</Link> : title}
				</h2>
				{actions}
			</div>
			{children}
		</div>
	);
};
