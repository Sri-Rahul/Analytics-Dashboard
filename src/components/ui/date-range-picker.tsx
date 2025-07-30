"use client";

import React, { useState } from "react";
// import { DateRangePicker as HeroUIDateRangePicker } from "@heroui/date-picker";
import { Button } from "./button";
import { Card } from "./card";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const presetRanges = [
  {
    label: "Last 7 days",
    getValue: () => ({
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      to: new Date(),
    }),
  },
  {
    label: "Last 14 days",
    getValue: () => ({
      from: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      to: new Date(),
    }),
  },
  {
    label: "Last 30 days",
    getValue: () => ({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date(),
    }),
  },
  {
    label: "Last 90 days",
    getValue: () => ({
      from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      to: new Date(),
    }),
  },
  {
    label: "This month",
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: start, to: now };
    },
  },
  {
    label: "Last month",
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { from: start, to: end };
    },
  },
];

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Select date range",
  className,
  disabled = false,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(value);

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return placeholder;
    if (!range.to) return range.from.toLocaleDateString();
    return `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`;
  };

  const handlePresetSelect = (preset: typeof presetRanges[0]) => {
    const range = preset.getValue();
    setSelectedRange(range);
    onChange?.(range);
    setIsOpen(false);
  };

  const handleCustomRangeChange = (range: DateRange | undefined) => {
    setSelectedRange(range);
    onChange?.(range);
  };

  const handleClear = () => {
    setSelectedRange(undefined);
    onChange?.(undefined);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full justify-between text-left font-normal",
          !selectedRange && "text-muted-foreground"
        )}
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {formatDateRange(selectedRange)}
        </div>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 z-50 mt-2 w-full min-w-[400px]"
          >
            <Card className="p-4 shadow-lg border">
              <div className="space-y-4">
                {/* Preset Ranges */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Quick Select</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {presetRanges.map((preset) => (
                      <Button
                        key={preset.label}
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePresetSelect(preset)}
                        className="justify-start text-sm h-8"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Date Range */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Custom Range</h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">From</label>
                        <input
                          type="date"
                          value={selectedRange?.from?.toISOString().split('T')[0] || ''}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : undefined;
                            handleCustomRangeChange({
                              from: date,
                              to: selectedRange?.to,
                            });
                          }}
                          className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">To</label>
                        <input
                          type="date"
                          value={selectedRange?.to?.toISOString().split('T')[0] || ''}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : undefined;
                            handleCustomRangeChange({
                              from: selectedRange?.from,
                              to: date,
                            });
                          }}
                          className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}