'use client';

import { useEffect, useRef } from 'react';
import { Terminal, ChevronDown } from 'lucide-react';

interface LogEntry {
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'ai';
}

interface GenerationTerminalProps {
  logs: LogEntry[];
  isOpen: boolean;
  onToggle: () => void;
  currentStep: string;
  progress: number;
}

export function GenerationTerminal({
  logs,
  isOpen,
  onToggle,
  currentStep,
  progress,
}: GenerationTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getTypeColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return 'text-[#054d28]';
      case 'error':
        return 'text-[#d03238]';
      case 'warning':
        return 'text-[#ffd11a]';
      case 'ai':
        return 'text-[#163300]';
      default:
        return 'text-[#454745]';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-[#9fe870] text-[#163300] rounded-full shadow-[rgba(14,15,12,0.12)_0px_0px_0px_1px] transition-all hover:scale-105 active:scale-95"
      >
        <Terminal className="w-4 h-4" />
        <span className="text-sm font-semibold">View AI Logs</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <div className="bg-white rounded-[40px] shadow-[rgba(14,15,12,0.12)_0px_0px_0px_1px] border border-[rgba(14,15,12,0.12)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-[#f5f7f4] rounded-t-[40px]">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-[#163300]" />
            <span className="text-base font-semibold text-[#0e0f0c]">AI Generation Log</span>
          </div>
          <button
            onClick={onToggle}
            className="p-2 rounded-full bg-[#9fe870] text-[#163300] transition-all hover:scale-105 active:scale-95"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-4 bg-[#e8ebe6] border-b border-[rgba(14,15,12,0.12)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#868685]">Status:</span>
              <span className="text-base font-semibold text-[#163300] truncate max-w-[180px]">
                {currentStep || 'Ready'}
              </span>
            </div>
            <span className="text-base font-semibold text-[#0e0f0c]">{progress}%</span>
          </div>
          <div className="h-2 bg-[rgba(22,51,0,0.08)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#9fe870] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div
          ref={scrollRef}
          className="h-80 overflow-y-auto p-6 bg-[#f5f7f4]"
        >
          <div className="space-y-2 font-mono text-sm text-[#454745]">
            {logs.map((log, index) => (
              <div key={index} className="flex gap-3">
                <span className="text-[#868685] shrink-0">[{formatTime(log.timestamp)}]</span>
                <span className={getTypeColor(log.type)}>{log.message}</span>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="flex gap-3">
                <span className="text-[#868685] shrink-0">[{formatTime(new Date())}]</span>
                <span className="text-[#868685]">Waiting for generation to start...</span>
              </div>
            )}
            <div className="flex gap-3">
              <span className="text-[#868685] shrink-0">[{formatTime(new Date())}]</span>
              <span className="text-[#163300] animate-pulse">▋</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { LogEntry };