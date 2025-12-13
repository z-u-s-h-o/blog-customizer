import { useState, useEffect, useRef } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import { Select } from 'src/ui/select';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';
import {
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	OptionType,
	ArticleStateType,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	articlePageState: ArticleStateType;
	onStateChange: (updates: Partial<ArticleStateType>) => void;
	onReset: () => void;
};

export const ArticleParamsForm = (props: ArticleParamsFormProps) => {
	const { articlePageState, onStateChange, onReset } = props;

	//Состояние сайдбара
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const sidebarRef = useRef<HTMLDivElement>(null);

	//Локальное состояние для выбранных параметров (не влияет на articlePageState до нажатия "Применить")
	const [articleFormState, setArticleFormState] =
		useState<ArticleStateType>(articlePageState);

	//Меняем состояние сайдбара при нажатии на «стрелку»
	const handleToggle = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	// Обеспечиваем обработку клика вне элемента сайдбара для его скрытия
	// + синхронизируем состояние формы статьи с текущими, примененными настройками
	useEffect(() => {
		if (!isMenuOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(event.target as Node)
			) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		setArticleFormState(articlePageState);

		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isMenuOpen]);

	// Обновляем локальное состояние при выборе опций
	const handleOptionChange = (
		key: keyof ArticleStateType,
		selected: OptionType
	) => {
		setArticleFormState((prev) => ({ ...prev, [key]: selected }));
	};

	// При нажатии "Применить" передаём все изменения для страницы статьи, закрываем сайдбар
	const handleApply = (e: React.FormEvent) => {
		e.preventDefault();

		const changedFields: Partial<ArticleStateType> = {};

		Object.keys(articleFormState).forEach((key) => {
			const k = key as keyof ArticleStateType;
			if (
				articlePageState[k]?.value !== articleFormState[k]?.value &&
				k in articlePageState
			) {
				changedFields[k] = articleFormState[k];
			}
		});

		onStateChange(changedFields);
		setIsMenuOpen(false);
	};

	// При нажатии "Сбросить", выполняем переданную функцию и закрываем сайдбар
	const handleReset = () => {
		onReset();
		setIsMenuOpen(false);
	};

	return (
		<>
			<ArrowButton isOpen={isMenuOpen} onClick={handleToggle} />
			<aside
				ref={sidebarRef}
				className={`${styles.container} ${
					isMenuOpen && styles.container_open
				}`}>
				<form className={styles.form} onSubmit={handleApply}>
					<div className={styles.optionContainer}>
						<Text size={31} weight={800} uppercase>
							Задайте параметры
						</Text>
						<Select
							selected={articleFormState.fontFamilyOption}
							options={fontFamilyOptions}
							placeholder='Выберите шрифт'
							onChange={(selected) =>
								handleOptionChange('fontFamilyOption', selected)
							}
							title='Шрифт'
						/>
						<RadioGroup
							name='string'
							options={fontSizeOptions}
							selected={articleFormState.fontSizeOption}
							onChange={(selected) =>
								handleOptionChange('fontSizeOption', selected)
							}
							title='Font_size'
						/>
						<Select
							selected={articleFormState.fontColor}
							options={fontColors}
							placeholder='Выберите цвет шрифта'
							onChange={(selected) => handleOptionChange('fontColor', selected)}
							title='Цвет шрифта'
						/>
						<Separator />
						<Select
							selected={articleFormState.backgroundColor}
							options={backgroundColors}
							placeholder='Выберите цвет фона'
							onChange={(selected) =>
								handleOptionChange('backgroundColor', selected)
							}
							title='Цвет фона'
						/>
						<Select
							selected={articleFormState.contentWidth}
							options={contentWidthArr}
							placeholder='Выберите ширину контента'
							onChange={(selected) =>
								handleOptionChange('contentWidth', selected)
							}
							title='Ширина контента'
						/>
					</div>
					<div className={styles.bottomContainer}>
						<Button
							title='Сбросить'
							htmlType='reset'
							type='clear'
							onClick={handleReset}
						/>
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
