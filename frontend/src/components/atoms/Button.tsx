import './Button.css';

type ButtonProps = React.ComponentProps<'button'> & {
	variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'menu';
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
