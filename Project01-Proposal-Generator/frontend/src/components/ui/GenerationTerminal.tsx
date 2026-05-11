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
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'ai':
        return 'text-cyan-600';
      default:
        return 'text-gray-400';
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
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-750 rounded-lg shadow-2xl border border-gray-700 transition-all"
      >
        <Terminal className="w-4 h-4 text-green-400" />
        <span className="text-sm font-medium text-gray-200">View AI Logs</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <div className="bg-gray-900 rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-gray-200">AI Generation Log</span>
          </div>
          <button onClick={onToggle} className="p-1 hover:bg-gray-700 rounded">
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="px-4 py-2 bg-gray-850 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Status:</span>
              <span className="text-sm text-cyan-400 truncate max-w-[180px]">{currentStep || 'Ready'}</span>
            </div>
            <span className="text-sm text-gray-400">{progress}%</span>
          </div>
          <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div
          ref={scrollRef}
          className="h-80 overflow-y-auto p-4 font-mono text-xs"
          style={{ backgroundColor: '#1a1a1a' }}
        >
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-gray-500 shrink-0">[{formatTime(log.timestamp)}]</span>
                <span className={getTypeColor(log.type)}>{log.message}</span>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="flex gap-2">
                <span className="text-gray-500 shrink-0">[{formatTime(new Date())}]</span>
                <span className="text-gray-400">Waiting for generation to start...</span>
              </div>
            )}
            <div className="flex gap-2">
              <span className="text-gray-500 shrink-0">[{formatTime(new Date())}]</span>
              <span className="text-green-400 animate-pulse">▋</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { LogEntry };