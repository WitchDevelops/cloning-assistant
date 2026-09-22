import './Card.css';

type CardProps = {
	title: string;
	children: React.ReactNode;
	className?: string;
};

export const Card = ({ title, children, className }: CardProps) => {
	return (
		<div className={`card ${className ?? ''}`}>
			<h2 className="card__title">{title}</h2>
			{children}
		</div>
	);
};
