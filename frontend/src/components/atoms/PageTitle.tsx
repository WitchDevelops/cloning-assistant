type PageTitleProps = {
	title: string;
};

export const PageTitle = ({ title }: PageTitleProps) => {
	return <title>{`${title} · Molecular biology assistant`}</title>;
};
