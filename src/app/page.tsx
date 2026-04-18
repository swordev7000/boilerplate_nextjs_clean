import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");
  return (
    <main className="bg-yellow-300">
      <section>{t("title")}</section>
    </main>
  );
}
