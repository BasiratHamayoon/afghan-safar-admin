import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  let locale = await getLocale();
  !["en", "ps", "fa"].includes(locale) && (locale = "en");

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

const getLocale = async (): Promise<string> => {
  const cookieStore = await cookies();
  const languageCookie = cookieStore.get("language");

  return languageCookie?.value || "en";
};
