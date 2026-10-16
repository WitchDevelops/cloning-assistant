type PageTitleProps = {
	title: string;
};

export const PageTitle = ({ title }: PageTitleProps) => {
	return (
		<>
			<title>{`${title} · Molecular biology assistant`}</title>{' '}
			<h1 className="sr-only">{title}</h1>
		</>
	);
};
