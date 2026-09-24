import React, { useEffect, useId, useRef, useState } from 'react';
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

export const Menu = ({ label, items }: MenuProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const menuId = useId();

	useEffect(() => {
		if (isOpen) {
			itemRefs.current[activeIndex]?.focus();
		}
	}, [isOpen, activeIndex]);

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

	const openMenu = (index: number) => {
		setActiveIndex(index);
		setIsOpen(true);
	};

	// focus the first item when opened - WAI/ARIA Menu button pattern
	// https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/

	const focusItem = (index: number) => {
		const wrapped = (index + items.length) % items.length;
		setActiveIndex(wrapped);
		itemRefs.current[wrapped]?.focus();
	};

	const handleTriggerClick = () => {
		if (isOpen) {
			setIsOpen(false);
		} else {
			openMenu(0);
		}
	};

	// keyboard accessibility - WAI/ARIA Menu button pattern
	// https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/

	const handleTriggerKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			openMenu(0);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			openMenu(items.length - 1);
		}
	};

	const handlePanelKeyDown = (event: React.KeyboardEvent) => {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				focusItem(activeIndex + 1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				focusItem(activeIndex - 1);
				break;
			case 'Home':
				event.preventDefault();
				focusItem(0);
				break;
			case 'End':
				event.preventDefault();
				focusItem(items.length - 1);
				break;
		}
	};

	const handlePanelBlur = (event: React.FocusEvent) => {
		if (!containerRef.current?.contains(event.relatedTarget as Node)) {
			setIsOpen(false);
		}
	};

	return (
		<div className="menu" ref={containerRef}>
			<Button
				ref={triggerRef}
				type="button"
				variant="menu"
				className="menu__trigger"
				aria-haspopup="menu"
				aria-expanded={isOpen}
				aria-controls={menuId}
				aria-label={label}
				onClick={handleTriggerClick}
				onKeyDown={handleTriggerKeyDown}
			>
				⋮
			</Button>
			{isOpen && items && (
				<div
					className="menu__panel"
					role="menu"
					id={menuId}
					onKeyDown={handlePanelKeyDown}
					onBlur={handlePanelBlur}
				>
					{items.map((item, index) => (
						<Button
							type="button"
							variant="ghost"
							key={item.label}
							role="menuitem"
							className="menu__item"
							onClick={() => {
								item.onSelect();
								setIsOpen(false);
								triggerRef.current?.focus();
							}}
							ref={(el) => {
								itemRefs.current[index] = el;
							}}
							tabIndex={index === activeIndex ? 0 : -1}
						>
							{item.label}
						</Button>
					))}
				</div>
			)}
		</div>
	);
};
