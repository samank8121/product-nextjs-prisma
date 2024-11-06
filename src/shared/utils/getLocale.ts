export const getLocale = (acceptLanguage: string | null) => {
  console.log("acceptLanguage:", acceptLanguage);
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().split('-')[0]);
    return languages[0];
  }
  return 'en';
};
