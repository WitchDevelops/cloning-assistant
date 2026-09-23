import { useEffect, useRef, useState } from 'react';
import { Button } from '../atoms/Button';
import './Menu.css';

type MenuItem = {
	label: string;
	onSelect: () => void;
};

type MenuProps = {
	label: string;
	items: MenuItem[];
};

const testItems = [
	{ label: 'item 1', onSelect: () => console.log(`helo`) },
	{ label: 'item 2', onSelect: () => console.log(`helo`) },
];

export const Menu = ({ label, items = testItems }: MenuProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);

	// close on clicking outside needs binding an event, same is true for closing with Esc
	useEffect(() => {
		if (!isOpen) return;

		const closeIfOutside = (event: PointerEvent) => {
			if (!containerRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsOpen(false);
				triggerRef.current?.focus();
			}
		};

		document.addEventListener('pointerdown', closeIfOutside);
		document.addEventListener('keydown', closeOnEscape);

		return () => {
			document.removeEventListener('pointerdown', closeIfOutside);
			document.removeEventListener('keydown', closeOnEscape);
		};
	}, [isOpen]);

	return (
		<div className="menu" ref={containerRef}>
			<Button
				ref={triggerRef}
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
			{isOpen && items && (
				<div className="menu__panel" role="menu">
					{items.map((item) => (
						<Button
							type="button"
							variant="ghost"
							key={item.label}
							role="menuitem"
							className="menu__item"
							onClick={() => {
								item.onSelect();
								setIsOpen(false);
							}}
						>
							{item.label}
						</Button>
					))}
				</div>
			)}
		</div>
	);
};
