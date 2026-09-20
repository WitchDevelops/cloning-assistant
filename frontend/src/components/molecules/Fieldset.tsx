type FieldsetProps = {
	legend: string;
	name: string;
	error?: string;
	children: React.ReactNode;
};

export const Fieldset = ({ legend, name, error, children }: FieldsetProps) => {
	const errorId = `${name}-error`;

	return (
		<fieldset className="fieldset">
			<legend className="fieldset__legend">{legend}</legend>
			<div className="fieldset__content">{children}</div>
			<p id={errorId} aria-live="polite" className="fieldset__error">
				{error}
			</p>
		</fieldset>
	);
};
