import { useState } from 'react';
import { Button } from '../atoms/Button';
import './Menu.css';

type MenuProps = {
	label: string;
};

export const Menu = ({ label }: MenuProps) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Button
			type="button"
			variant="menu"
			className="menu__trigger"
			aria-haspopup="menu"
			aria-expanded={isOpen}
			aria-label={label}
			onClick={() => setIsOpen((open) => !open)}
		>
			⋮
		</Button>
	);
};
