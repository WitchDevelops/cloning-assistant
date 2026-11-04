import './Fieldset.css';

type FieldsetVariant = 'outlined-group' | 'default';

type FieldsetProps = {
	legend: string;
	children: React.ReactNode;
	variant?: FieldsetVariant;
};

export const Fieldset = ({
	legend,
	children,
	variant = 'default',
}: FieldsetProps) => {
	return (
		<fieldset className={`fieldset fieldset--${variant}`}>
			<legend className="fieldset__legend">{legend}</legend>
			<div className="fieldset__content">{children}</div>
		</fieldset>
	);
};
