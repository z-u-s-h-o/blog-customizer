import { useState, StrictMode, CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';

import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import {
	defaultArticleState,
	ArticleStateType,
} from './constants/articleProps';

import './styles/index.scss';
import styles from './styles/index.module.scss';
import clsx from 'clsx';

const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);

const App = () => {
	// Состояние для страницы
	const [articlePageState, setArticlePageState] =
		useState<ArticleStateType>(defaultArticleState);

	// Обработчик изменения состояния страницы при применении изменений в форме
	const handleStateArticlePageChange = (updates: Partial<ArticleStateType>) => {
		setArticlePageState((prev) => ({
			...prev,
			...updates,
		}));
	};

	// Сброс к дефолтным настройкам
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
				} as CSSProperties
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

root.render(
	<StrictMode>
		<App />
	</StrictMode>
);
