'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  useFocusable,
  FocusContext,
  setFocus,
} from '@noriginmedia/norigin-spatial-navigation';
import { getPredictions } from '@/data/wordList';
import { KeyConfig } from '@/types';

interface PredictiveKeyboardProps {
  onTextChange: (text: string) => void;
  onPredictionsChange?: (predictions: string[]) => void;
  initialText?: string;
}

// Key mappings - multi-tap characters for each key
const KEY_CHARS: { [key: string]: string[] } = {
  '1': ['.', ',', "'", '!', '?', '-', '(', ')', '@', '/', ':'],
  '2': ['a', 'b', 'c'],
  '3': ['d', 'e', 'f'],
  '4': ['g', 'h', 'i'],
  '5': ['j', 'k', 'l'],
  '6': ['m', 'n', 'o'],
  '7': ['p', 'q', 'r', 's'],
  '8': ['t', 'u', 'v'],
  '9': ['w', 'x', 'y', 'z'],
  '0': [' '],
};

const KEYBOARD_LAYOUT: KeyConfig[][] = [
  [
    { key: '1', chars: ".,'-", label: "1 .,'-", type: 'special' },
    { key: '2', chars: 'abc', label: '2 ABC', type: 'letter' },
    { key: '3', chars: 'def', label: '3 DEF', type: 'letter' },
  ],
  [
    { key: '4', chars: 'ghi', label: '4 GHI', type: 'letter' },
    { key: '5', chars: 'jkl', label: '5 JKL', type: 'letter' },
    { key: '6', chars: 'mno', label: '6 MNO', type: 'letter' },
  ],
  [
    { key: '7', chars: 'pqrs', label: '7 PQRS', type: 'letter' },
    { key: '8', chars: 'tuv', label: '8 TUV', type: 'letter' },
    { key: '9', chars: 'wxyz', label: '9 WXYZ', type: 'letter' },
  ],
  [
    { key: 'lang', chars: '', label: '🌐', type: 'action' },
    { key: '0', chars: ' ', label: '0 ␣', type: 'special' },
    { key: 'del', chars: '', label: '⌫', type: 'action' },
  ],
];

// Confirmation timeout in milliseconds
const CONFIRM_TIMEOUT = 1500;

interface KeyButtonProps {
  config: KeyConfig;
  onPress: () => void;
  onLongPress?: () => void;
  focusKeyName: string;
  isActive?: boolean;
  isWide?: boolean;
}

// Navigation mapping for infinite loop - defined outside component to avoid recreation
const NAVIGATION_MAP: { [key: string]: { up?: string; down?: string; left?: string; right?: string } } = {
  // Row 0 - pressing up wraps to row 3 (0/space bar)
  'key-1': { up: 'key-0', down: 'key-4', left: 'key-1', right: 'key-2' },
  'key-2': { up: 'key-0', down: 'key-5', left: 'key-1', right: 'key-3' },
  'key-3': { up: 'key-0', down: 'key-6', left: 'key-2' }, // right goes to movie grid
  // Row 1
  'key-4': { up: 'key-1', down: 'key-7', left: 'key-4', right: 'key-5' },
  'key-5': { up: 'key-2', down: 'key-8', left: 'key-4', right: 'key-6' },
  'key-6': { up: 'key-3', down: 'key-9', left: 'key-5' }, // right goes to movie grid
  // Row 2 - pressing down goes to 0/space bar
  'key-7': { up: 'key-4', down: 'key-0', left: 'key-7', right: 'key-8' },
  'key-8': { up: 'key-5', down: 'key-0', left: 'key-7', right: 'key-9' },
  'key-9': { up: 'key-6', down: 'key-0', left: 'key-8' }, // right goes to movie grid
  // Row 3 - pressing down wraps to row 0 (2)
  'key-lang': { up: 'key-7', down: 'key-2', left: 'key-lang', right: 'key-0' },
  'key-0': { up: 'key-8', down: 'key-2', left: 'key-lang', right: 'key-del' },
  'key-del': { up: 'key-9', down: 'key-2', left: 'key-0', right: 'key-del' },
};

function KeyButton({ config, onPress, onLongPress, focusKeyName, isActive, isWide }: KeyButtonProps) {
  const { ref, focused } = useFocusable({
    onEnterPress: onPress,
    focusKey: focusKeyName,
    onArrowPress: (direction: string) => {
      const nav = NAVIGATION_MAP[focusKeyName];
      if (nav) {
        const targetKey = nav[direction as keyof typeof nav];
        if (targetKey) {
          setFocus(targetKey);
          return false; // Prevent default navigation
        }
      }
      return true; // Allow default navigation (for keys 3, 6, 9 going right to movie grid)
    },
  });

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const pressStart = useRef<number>(0);

  const handleMouseDown = () => {
    pressStart.current = Date.now();
    longPressTimer.current = setTimeout(() => {
      if (onLongPress) {
        onLongPress();
      }
    }, 3000);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    const pressDuration = Date.now() - pressStart.current;
    if (pressDuration < 3000) {
      onPress();
    }
  };

  return (
    <div
      ref={ref}
      data-focuskey={focusKeyName}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
      }}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPress();
        }
      }}
      className={`
        flex flex-col items-center justify-center
        ${isWide ? 'w-[230px]' : 'w-[110px]'} h-[85px] rounded-lg cursor-pointer
        transition-all duration-150 select-none
        focus:outline-none
        ${focused
          ? 'bg-white text-black scale-110 shadow-lg shadow-white/30 ring-2 ring-white'
          : isActive
            ? 'bg-blue-600 text-white scale-105'
            : 'bg-gray-800 text-white hover:bg-gray-700'
        }
      `}
    >
      <span className="text-[22px] font-bold leading-none">
        {config.key === 'lang' ? '🌐' : config.key === 'del' ? '⌫' : config.key}
      </span>
      {config.type === 'letter' && (
        <span className="text-[24px] mt-1 uppercase tracking-wider opacity-80">
          {config.chars}
        </span>
      )}
      {config.key === '0' && (
        <span className="text-[24px] mt-1 opacity-80">SPACE</span>
      )}
      {config.key === '1' && (
        <span className="text-[24px] mt-1 opacity-80">.,!?-</span>
      )}
    </div>
  );
}

export function PredictiveKeyboard({
  onTextChange,
  onPredictionsChange,
  initialText = ''
}: PredictiveKeyboardProps) {
  // Confirmed text (finalized characters)
  const [confirmedText, setConfirmedText] = useState(initialText);
  // Current character being cycled (not yet confirmed)
  const [pendingChar, setPendingChar] = useState<string | null>(null);
  // Ref to track pending char for timer callback (avoids stale closure)
  const pendingCharRef = useRef<string | null>(null);
  // Current key being pressed (for cycling)
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  // Index in the character array for current key
  const [charIndex, setCharIndex] = useState(0);
  // Timer for auto-confirmation
  const confirmTimer = useRef<NodeJS.Timeout | null>(null);
  // Timer progress for visual feedback (0-100)
  const [timerProgress, setTimerProgress] = useState(0);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  // Container ref for keyboard event listener
  const containerRef = useRef<HTMLDivElement>(null);

  const { ref, focusKey } = useFocusable({
    focusable: false,
    saveLastFocusedChild: true,
    trackChildren: true,
    isFocusBoundary: false,
  });

  // Set initial focus to key 5 on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setFocus('key-5');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Full display text
  const displayText = confirmedText + (pendingChar || '');

  // Notify parent of text changes
  useEffect(() => {
    onTextChange(displayText);
  }, [displayText, onTextChange]);

  // Update predictions based on current text
  useEffect(() => {
    if (displayText) {
      // Get the current word being typed
      const words = displayText.split(' ');
      const currentWord = words[words.length - 1];
      if (currentWord) {
        // Convert to numeric sequence for prediction
        const numericSeq = currentWord.split('').map(char => {
          for (const [key, chars] of Object.entries(KEY_CHARS)) {
            if (chars.includes(char.toLowerCase())) {
              return key;
            }
          }
          return '';
        }).join('');

        if (numericSeq) {
          const preds = getPredictions(numericSeq, 5);
          onPredictionsChange?.(preds);
        } else {
          onPredictionsChange?.([]);
        }
      } else {
        onPredictionsChange?.([]);
      }
    } else {
      onPredictionsChange?.([]);
    }
  }, [displayText, onPredictionsChange]);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (confirmTimer.current) clearTimeout(confirmTimer.current);
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, []);

  // Keep pendingCharRef in sync with pendingChar state
  useEffect(() => {
    pendingCharRef.current = pendingChar;
  }, [pendingChar]);

  // Confirm the pending character (uses ref to avoid stale closure)
  const confirmPendingChar = useCallback(() => {
    const charToConfirm = pendingCharRef.current;
    if (charToConfirm !== null) {
      setConfirmedText(prev => prev + charToConfirm);
      setPendingChar(null);
      pendingCharRef.current = null;
      setCurrentKey(null);
      setCharIndex(0);
      setTimerProgress(0);
      if (confirmTimer.current) {
        clearTimeout(confirmTimer.current);
        confirmTimer.current = null;
      }
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
    }
  }, []);

  // Start the confirmation timer
  const startConfirmTimer = useCallback(() => {
    // Clear existing timers
    if (confirmTimer.current) clearTimeout(confirmTimer.current);
    if (timerInterval.current) clearInterval(timerInterval.current);

    setTimerProgress(0);

    // Start progress animation
    const startTime = Date.now();
    timerInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / CONFIRM_TIMEOUT) * 100, 100);
      setTimerProgress(progress);
    }, 50);

    // Set confirmation timeout
    confirmTimer.current = setTimeout(() => {
      confirmPendingChar();
    }, CONFIRM_TIMEOUT);
  }, [confirmPendingChar]);

  // Handle delete action
  const handleDelete = useCallback(() => {
    if (pendingChar !== null) {
      setPendingChar(null);
      setCurrentKey(null);
      setCharIndex(0);
      setTimerProgress(0);
      if (confirmTimer.current) clearTimeout(confirmTimer.current);
      if (timerInterval.current) clearInterval(timerInterval.current);
    } else if (confirmedText.length > 0) {
      setConfirmedText(prev => prev.slice(0, -1));
    }
  }, [pendingChar, confirmedText]);

  // Handle key press
  const handleKeyPress = useCallback((key: string) => {
    if (key === 'del') {
      handleDelete();
      return;
    }

    if (key === 'lang') {
      console.log('Language switch pressed');
      return;
    }

    const chars = KEY_CHARS[key];
    if (!chars) return;

    // Check if same key is pressed again (cycling)
    if (key === currentKey && pendingChar !== null) {
      // Cycle to next character
      const nextIndex = (charIndex + 1) % chars.length;
      setCharIndex(nextIndex);
      setPendingChar(chars[nextIndex]);
      // Restart timer
      startConfirmTimer();
    } else {
      // Different key pressed
      // First, confirm any pending character INSTANTLY
      if (pendingChar !== null) {
        setConfirmedText(prev => prev + pendingChar);
      }

      // Clear old timers
      if (confirmTimer.current) clearTimeout(confirmTimer.current);
      if (timerInterval.current) clearInterval(timerInterval.current);

      // Start new character
      setCurrentKey(key);
      setCharIndex(0);
      setPendingChar(chars[0]);

      // Start confirmation timer
      startConfirmTimer();
    }
  }, [currentKey, pendingChar, charIndex, startConfirmTimer, handleDelete]);

  // Handle long press (insert digit)
  const handleLongPress = useCallback((key: string) => {
    if (KEY_CHARS[key]) {
      // Confirm any pending char first
      const charToConfirm = pendingCharRef.current;
      if (charToConfirm !== null) {
        setConfirmedText(prev => prev + charToConfirm);
        setPendingChar(null);
        pendingCharRef.current = null;
      }
      // Insert the digit
      setConfirmedText(prev => prev + key);
      setCurrentKey(null);
      setCharIndex(0);
      if (confirmTimer.current) clearTimeout(confirmTimer.current);
      if (timerInterval.current) clearInterval(timerInterval.current);
    }
  }, []);

  // Global keyboard event listener for Backspace
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [handleDelete]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="flex flex-col gap-4">
        {/* Search Input Display */}
        <div
          ref={containerRef}
          className="bg-gray-900 rounded-lg p-4 min-h-[56px] border border-gray-700 flex items-center relative"
        >
          <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-xl text-white flex-1">
            {confirmedText}
            {pendingChar !== null && (
              <span className="text-blue-400 animate-pulse">{pendingChar}</span>
            )}
            <span className="animate-pulse text-white">|</span>
          </p>

          {/* Timer indicator */}
          {pendingChar !== null && timerProgress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-b-lg overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-50"
                style={{ width: `${timerProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* Keyboard Grid */}
        <div className="flex flex-col gap-2 mt-2">
          {/* Row 1: 1, 2, 3 */}
          <div className="flex gap-2 justify-center">
            <KeyButton
              config={KEYBOARD_LAYOUT[0][0]}
              onPress={() => handleKeyPress('1')}
              onLongPress={() => handleLongPress('1')}
              focusKeyName="key-1"
              isActive={currentKey === '1'}
            />
            <KeyButton
              config={KEYBOARD_LAYOUT[0][1]}
              onPress={() => handleKeyPress('2')}
              onLongPress={() => handleLongPress('2')}
              focusKeyName="key-2"
              isActive={currentKey === '2'}
            />
            <KeyButton
              config={KEYBOARD_LAYOUT[0][2]}
              onPress={() => handleKeyPress('3')}
              onLongPress={() => handleLongPress('3')}
              focusKeyName="key-3"
              isActive={currentKey === '3'}
            />
          </div>
          {/* Row 2: 4, 5, 6 */}
          <div className="flex gap-2 justify-center">
            <KeyButton
              config={KEYBOARD_LAYOUT[1][0]}
              onPress={() => handleKeyPress('4')}
              onLongPress={() => handleLongPress('4')}
              focusKeyName="key-4"
              isActive={currentKey === '4'}
            />
            <KeyButton
              config={KEYBOARD_LAYOUT[1][1]}
              onPress={() => handleKeyPress('5')}
              onLongPress={() => handleLongPress('5')}
              focusKeyName="key-5"
              isActive={currentKey === '5'}
            />
            <KeyButton
              config={KEYBOARD_LAYOUT[1][2]}
              onPress={() => handleKeyPress('6')}
              onLongPress={() => handleLongPress('6')}
              focusKeyName="key-6"
              isActive={currentKey === '6'}
            />
          </div>
          {/* Row 3: 7, 8, 9 */}
          <div className="flex gap-2 justify-center">
            <KeyButton
              config={KEYBOARD_LAYOUT[2][0]}
              onPress={() => handleKeyPress('7')}
              onLongPress={() => handleLongPress('7')}
              focusKeyName="key-7"
              isActive={currentKey === '7'}
            />
            <KeyButton
              config={KEYBOARD_LAYOUT[2][1]}
              onPress={() => handleKeyPress('8')}
              onLongPress={() => handleLongPress('8')}
              focusKeyName="key-8"
              isActive={currentKey === '8'}
            />
            <KeyButton
              config={KEYBOARD_LAYOUT[2][2]}
              onPress={() => handleKeyPress('9')}
              onLongPress={() => handleLongPress('9')}
              focusKeyName="key-9"
              isActive={currentKey === '9'}
            />
          </div>
          {/* Row 4: lang, 0 (wide space), del */}
          <div className="flex gap-2 justify-center">
            <KeyButton
              config={KEYBOARD_LAYOUT[3][0]}
              onPress={() => handleKeyPress('lang')}
              focusKeyName="key-lang"
              isActive={false}
            />
            <KeyButton
              config={KEYBOARD_LAYOUT[3][1]}
              onPress={() => handleKeyPress('0')}
              onLongPress={() => handleLongPress('0')}
              focusKeyName="key-0"
              isActive={currentKey === '0'}
              isWide={true}
            />
            <KeyButton
              config={KEYBOARD_LAYOUT[3][2]}
              onPress={() => handleKeyPress('del')}
              focusKeyName="key-del"
              isActive={false}
            />
          </div>
        </div>

        {/* Helper text */}
        <p className="text-gray-500 text-xs text-center mt-2">
          Press same key to cycle • Wait 1.5s to confirm • Backspace to delete
        </p>
      </div>
    </FocusContext.Provider>
  );
}

export default PredictiveKeyboard;
