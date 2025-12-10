"use client";

import { useServerInsertedHTML } from "next/navigation";

export default function ThemeScript() {
  useServerInsertedHTML(() => {
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                const persisted = localStorage.getItem('theme');
                const isDark =
                  persisted === 'dark' ||
                  (!persisted &&
                   window.matchMedia('(prefers-color-scheme: dark)').matches);

                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            })();
          `,
        }}
      />
    );
  });

  return null;
}
