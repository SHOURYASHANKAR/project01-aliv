import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  variant = 'default',
  className 
}) => {
  const variants = {
    default: 'bg-card',
    primary: 'bg-primary-light',
    success: 'bg-success-light',
    warning: 'bg-warning-light',
  };

  const iconVariants = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/20 text-primary',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
  };

  return (
    <Card className={cn(variants[variant], "border-none shadow-sm", className)}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
            {trend && (
              <p className={cn(
                "text-xs font-medium",
                trend > 0 ? "text-success" : trend < 0 ? "text-destructive" : "text-muted-foreground"
              )}>
                {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}% vs last week
              </p>
            )}
          </div>
          
          {Icon && (
            <div className={cn(
              "rounded-lg p-2.5",
              iconVariants[variant]
            )}>
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
