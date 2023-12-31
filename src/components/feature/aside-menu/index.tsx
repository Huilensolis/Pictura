"use client";

import { Heading } from "@/components/ui/typography/heading";
import { IAsideMenuProps } from "./aside-menu.models";
import { AsideNavLink } from "./components/nav-item";

export function Aside({
  links,
  header: { title, subtitle },
  showBorderOnLinks = false,
}: IAsideMenuProps) {
  return (
    <nav className="w-full h-full dark:bg-cm-gray bg-neutral-200 p-5">
      <article className="flex flex-col w-full">
        <Heading extraClasses="font-semibold" level={8}>
          {title}
        </Heading>
        <p className="text-neutral-600 dark:text-neutral-400 mb-12">
          {subtitle}
        </p>
      </article>
      <ul className="flex flex-col gap-4 justify-center items-center">
        {links.map((linkItem) => (
          <li
            key={linkItem.href}
            className={`w-full ${
              showBorderOnLinks &&
              "border-b border-neutral-300 dark:border-neutral-700"
            }`}
          >
            <AsideNavLink
              title={linkItem.title}
              href={linkItem.href}
              icon={linkItem.icon}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
