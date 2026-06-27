'use client';

import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';
import { ThemeToggle } from './ThemeToggle';
import { User, LogOut, LayoutDashboard, CalendarDays, ClipboardList } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mapRoleToVariant } from '../helpers/helpers';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavigationBar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated) {
    return null;
  }

  const truncateUsername = (username, maxLength = 15) => {
    if (!username || username.length <= maxLength) {
      return username;
    }
    return username.substring(0, maxLength) + '...';
  };

  const isUsernameTruncated = (username, maxLength = 15) => {
    return username && username.length > maxLength;
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-2 border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <Link
        href="/"
        className="text-lg font-semibold tracking-tight hover:opacity-80 transition-opacity"
      >
        Baypath Humane Society
      </Link>

      <div className="flex items-center gap-3">
        <Button
          asChild
          variant={pathname === '/dogs' ? 'secondary' : 'ghost'}
          size="sm"
          className="hidden sm:inline-flex gap-2"
        >
          <Link href="/dogs" aria-label="Go to roster">
            <LayoutDashboard className="h-4 w-4" />
            Roster
          </Link>
        </Button>

        {user?.staffBoardEnabled && (
          <Button
            asChild
            variant={pathname === '/board' ? 'secondary' : 'ghost'}
            size="sm"
            className="hidden sm:inline-flex gap-2"
          >
            <Link href="/board" aria-label="Go to board">
              <CalendarDays className="h-4 w-4" />
              Board
            </Link>
          </Button>
        )}

        {user?.shiftBoardEnabled && (
          <Button
            asChild
            variant={pathname === '/my-shift' ? 'secondary' : 'ghost'}
            size="sm"
            className="hidden sm:inline-flex gap-2"
          >
            <Link href="/my-shift" aria-label="Go to my shift">
              <ClipboardList className="h-4 w-4" />
              My shift
            </Link>
          </Button>
        )}

        <Badge variant={mapRoleToVariant(user?.role)}>{user?.role}</Badge>

        {isUsernameTruncated(user?.username) ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm text-muted-foreground max-w-[80px] truncate inline-block">
                {truncateUsername(user?.username)}
              </span>
            </TooltipTrigger>
            <TooltipContent>{user?.username}</TooltipContent>
          </Tooltip>
        ) : (
          <span className="text-sm text-muted-foreground">
            {user?.username}
          </span>
        )}

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {/* Navigation links — always visible in dropdown, buttons above are hidden on mobile */}
            <DropdownMenuItem asChild>
              <Link href="/dogs" className="flex items-center gap-2 cursor-pointer">
                <LayoutDashboard className="h-4 w-4" />
                Roster
              </Link>
            </DropdownMenuItem>
            {user?.staffBoardEnabled && (
              <DropdownMenuItem asChild>
                <Link href="/board" className="flex items-center gap-2 cursor-pointer">
                  <CalendarDays className="h-4 w-4" />
                  Board
                </Link>
              </DropdownMenuItem>
            )}
            {user?.shiftBoardEnabled && (
              <DropdownMenuItem asChild>
                <Link href="/my-shift" className="flex items-center gap-2 cursor-pointer">
                  <ClipboardList className="h-4 w-4" />
                  My shift
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {user?.role === 'admin' && (
              <DropdownMenuItem asChild>
                <Link
                  href="/admin"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link
                href="/user"
                className="flex items-center gap-2 cursor-pointer"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2 text-destructive cursor-pointer focus:text-destructive"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default NavigationBar;
