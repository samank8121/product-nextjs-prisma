export const getLocale = (acceptLanguage: string | null) => {
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().split('-')[0]);
    return languages[0];
  }
  return 'en';
};
