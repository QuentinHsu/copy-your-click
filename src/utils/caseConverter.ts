export type CaseType =
	| "changeCase" // 驼峰命名法
	| "ChangeCase" // 帕斯卡命名法
	| "change_case" // 蛇形命名法
	| "change-case" // 短横线命名法
	| "CHANGE_CASE" // 大写蛇形命名法
	| "change case" // 小写空格命名法
	| "CHANGE CASE" // 大写空格命名法
	| "Change Case" // 标题命名法
	| "Change case" // 句子命名法
	| "change.case"; // 点命名法

/**
 * 将文件名转换为指定的大小写格式（不含扩展名）
 */
export function convertCase(fileName: string, caseType: CaseType): string {
	// 提取单词
	const words = extractWords(fileName);

	// 根据不同的大小写类型进行转换
	switch (caseType) {
		case "changeCase":
			return words
				.map((word, index) =>
					index === 0 ? word.toLowerCase() : capitalize(word),
				)
				.join("");

		case "ChangeCase":
			return words.map(capitalize).join("");

		case "change_case":
			return words.map((word) => word.toLowerCase()).join("_");

		case "change-case":
			return words.map((word) => word.toLowerCase()).join("-");

		case "CHANGE_CASE":
			return words.map((word) => word.toUpperCase()).join("_");

		case "change case":
			return words.map((word) => word.toLowerCase()).join(" ");

		case "CHANGE CASE":
			return words.map((word) => word.toUpperCase()).join(" ");

		case "Change Case":
			return words.map(capitalize).join(" ");

		case "Change case":
			return words
				.map((word, index) =>
					index === 0 ? capitalize(word) : word.toLowerCase(),
				)
				.join(" ");

		case "change.case":
			return words.map((word) => word.toLowerCase()).join(".");

		default:
			return fileName; // 如果没有匹配的格式，返回原始文件名
	}
}

/**
 * 将任意格式的字符串分解为单词数组
 */
function extractWords(str: string): string[] {
	// 1. 在大写字母前添加空格（处理驼峰命名法）
	const withSpacesBeforeUppercase = str.replace(/([a-z])([A-Z])/g, "$1 $2");

	// 2. 将其他分隔符(如破折号、下划线、点、斜杠)替换为空格
	const allSeparatorsToSpaces = withSpacesBeforeUppercase.replace(
		/[-_.\/]+/g,
		" ",
	);

	// 3. 拆分为单词数组并去除空项
	return allSeparatorsToSpaces.split(" ").filter((word) => word.length > 0);
}

/**
 * 将单词首字母大写
 */
function capitalize(word: string): string {
	if (!word) return "";
	return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
