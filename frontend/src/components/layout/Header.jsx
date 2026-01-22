import React from 'react';
import { Moon, Sun, Download, Upload, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHabits } from '@/context/HabitContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const Header = ({ onOpenSidebar }) => {
  const { settings, toggleTheme, handleExport, handleImport } = useHabits();
  
  const handleFileImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = handleImport(event.target?.result);
          if (!result.success) {
            alert('Failed to import data: ' + result.error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        {/* Left side - Mobile menu & Logo */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onOpenSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <svg
                className="h-5 w-5 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="hidden font-semibold text-foreground sm:inline-block">
              Habit Flow
            </span>
          </div>
        </div>
        
        {/* Right side - Actions */}
        <div className="flex items-center gap-1">
          <TooltipProvider delayDuration={0}>
            {/* Theme Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="h-9 w-9"
                >
                  {settings.theme === 'dark' ? (
                    <Sun className="h-[1.2rem] w-[1.2rem] text-muted-foreground transition-colors hover:text-foreground" />
                  ) : (
                    <Moon className="h-[1.2rem] w-[1.2rem] text-muted-foreground transition-colors hover:text-foreground" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Toggle {settings.theme === 'dark' ? 'light' : 'dark'} mode</p>
              </TooltipContent>
            </Tooltip>

            {/* Data Management Dropdown */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Download className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Backup & Restore</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleExport} className="cursor-pointer">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleFileImport} className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Import Data
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};

export default Header;
