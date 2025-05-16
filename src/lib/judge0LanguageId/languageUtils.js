export const getJudge0LanguageId = (language) => {
  const languageMap = {
    python: 71,
    java: 62,
    javascript: 63,
  };

  return languageMap[language];
};

export function getLanguageName(languageId) {
  const LANGUAGE_NAMES = {
    74: 'typeScript',
    63: 'javascript',
    71: 'python',
    62: 'java',
  };

  return LANGUAGE_NAMES[languageId] || 'Unknown';
}
