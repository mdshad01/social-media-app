export function setDarkMode(enabled: boolean) {
  if (enabled) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}

export function loadThemeOnStart() {
  const saved = localStorage.getItem("theme");

  if (saved === "dark") {
    document.documentElement.classList.add("dark");
  } else if (saved === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    // system preference fallback
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }
  }
}
