import type React from 'react';
import './Card.css';
import { Link } from 'react-router';

type BaseCardProps = {
	title: string;
	children: React.ReactNode;
	className?: string;
};

// Props: `to` and `actions` are mutually exclusive because it doesn't make sense for a clickable card to have additional actions, and a clickable card has the link extended over the whole card with CSS, so it would cover the dropdown. Combining these props would make for poor UX and would introduce a bug for mouse users.
type LinkCardProps = BaseCardProps & {
	to: string;
	/** Not allowed on a link card: the stretched link would cover the menu for mouse users. Use a content card instead. */
	actions?: never;
};

type ContentCardProps = BaseCardProps & {
	actions?: React.ReactNode;
	to?: never;
};

type CardProps = LinkCardProps | ContentCardProps;

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
