import { useState } from 'react';
import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import {
	defaultArticleState,
	ArticleStateType,
} from './constants/articleProps';
import styles from './styles/index.module.scss';
import clsx from 'clsx';

export const App = () => {
	const [articlePageState, setArticlePageState] =
		useState<ArticleStateType>(defaultArticleState);

	const handleStateArticlePageChange = (updates: Partial<ArticleStateType>) => {
		setArticlePageState((prev) => ({
			...prev,
			...updates,
		}));
	};

	const handleReset = () => {
		setArticlePageState(defaultArticleState);
	};

	return (
		<main
			className={clsx(styles.main)}
			style={
				{
					'--font-family': articlePageState.fontFamilyOption.value,
					'--font-size': articlePageState.fontSizeOption.value,
					'--font-color': articlePageState.fontColor.value,
					'--container-width': articlePageState.contentWidth.value,
					'--bg-color': articlePageState.backgroundColor.value,
				} as React.CSSProperties
			}>
			<ArticleParamsForm
				articlePageState={articlePageState}
				onStateChange={handleStateArticlePageChange}
				onReset={handleReset}
			/>
			<Article />
		</main>
	);
};
