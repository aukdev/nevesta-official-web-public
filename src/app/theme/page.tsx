import Link from "next/link";
import SwitchDarkMode from "@/shared/SwitchDarkMode";

export default function ThemePage() {
  return (
    <div className="container py-24 min-h-[60vh]">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
          Theme Switcher
        </h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-300">
          Toggle the theme using the button below. The site uses Tailwind
          &quot;dark&quot; class on the <code>html</code> element and the state
          is persisted in
          <code>localStorage.theme</code>.
        </p>

        <div className="mt-8 flex items-center justify-center space-x-4">
          <SwitchDarkMode className="!w-14 !h-14" />
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-lg bg-white dark:bg-neutral-800 border dark:border-neutral-700">
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-100">
              Example Card
            </h3>
            <p className="mt-2 text-neutral-600 dark:text-neutral-300 text-sm">
              This card demonstrates background and text color switching between
              light and dark modes.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-orange-50 dark:bg-black/20 border dark:border-neutral-700">
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-100">
              Another Example
            </h3>
            <p className="mt-2 text-neutral-600 dark:text-neutral-300 text-sm">
              Toggle theme to see how components respond. Refreshing the page
              keeps your preference.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="text-sm text-neutral-600 dark:text-neutral-300 hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
