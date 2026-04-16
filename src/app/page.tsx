import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");
  return (
    <main>
      <section>{t("title")}</section>
    </main>
  );
}
