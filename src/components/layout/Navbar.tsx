'use client';

import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

function NavItem({ href, label, icon, isActive }: NavItemProps) {
  const { ref, focused } = useFocusable();

  return (
    <Link
      ref={ref}
      href={href}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg
        transition-all duration-200 text-lg
        ${focused
          ? 'bg-white text-black'
          : isActive
            ? 'text-white'
            : 'text-gray-400 hover:text-white'
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { ref, focusKey } = useFocusable({
    focusable: false,
    saveLastFocusedChild: true,
    trackChildren: true,
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <nav
        ref={ref}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black to-transparent"
      >
        <div className="flex items-center justify-between px-12 py-6">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <h1 className="text-3xl font-bold text-red-600">
              MovieTV
            </h1>

            {/* Navigation Links */}
            <div className="flex items-center gap-2">
              <NavItem
                href="/"
                label="Home"
                isActive={pathname === '/'}
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                }
              />
              <NavItem
                href="/search"
                label="Search"
                isActive={pathname === '/search'}
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Right side - Profile/Settings */}
          <div className="flex items-center gap-4">
            <NavItem
              href="#"
              label="Favorites"
              icon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              }
            />
          </div>
        </div>
      </nav>
    </FocusContext.Provider>
  );
}

export default Navbar;
