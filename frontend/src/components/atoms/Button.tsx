import './Button.css';

type ButtonProps = React.ComponentProps<'button'> & {
	variant?:
		| 'primary'
		| 'secondary'
		| 'accent'
		| 'outline'
		| 'menu-trigger'
		| 'menu-item';
};

export const Button = ({
	variant = 'primary',
	className,
	...rest
}: ButtonProps) => {
	return (
		<button
			className={`button ${className ?? ''}`}
			data-variant={variant}
			{...rest}
		/>
	);
};
