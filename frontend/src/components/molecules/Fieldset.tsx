import './Fieldset.css';

type FieldsetProps = {
	legend: string;
	children: React.ReactNode;
};

export const Fieldset = ({ legend, children }: FieldsetProps) => {
	return (
		<fieldset className="fieldset">
			<legend className="fieldset__legend">{legend}</legend>
			<div className="fieldset__content">{children}</div>
		</fieldset>
	);
};
