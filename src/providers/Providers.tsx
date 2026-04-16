import { NextIntlClientProvider } from "next-intl";

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <NextIntlClientProvider>{children}</NextIntlClientProvider>;
}
