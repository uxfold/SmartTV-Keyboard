'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  useFocusable,
  FocusContext,
} from '@noriginmedia/norigin-spatial-navigation';
import { getPredictions } from '@/data/wordList';
import { KeyConfig } from '@/types';

interface PredictiveKeyboardProps {
  onTextChange: (text: string) => void;
  initialText?: string;
}

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

interface KeyButtonProps {
  config: KeyConfig;
  onPress: () => void;
  isActive?: boolean;
}

function KeyButton({ config, onPress, isActive }: KeyButtonProps) {
  const { ref, focused } = useFocusable({
    onEnterPress: onPress,
  });

  return (
    <div
      ref={ref}
      onClick={onPress}
      className={`
        flex flex-col items-center justify-center
        w-[120px] h-[80px] rounded-lg cursor-pointer
        transition-all duration-150 select-none
        ${focused
          ? 'bg-white text-black scale-110 shadow-lg shadow-white/30'
          : 'bg-gray-800 text-white hover:bg-gray-700'
        }
        ${isActive ? 'ring-2 ring-blue-500' : ''}
      `}
    >
      <span className="text-2xl font-bold">{config.key === 'lang' ? '🌐' : config.key === 'del' ? '⌫' : config.key}</span>
      {config.type === 'letter' && (
        <span className="text-xs mt-1 uppercase tracking-wider opacity-70">
          {config.chars}
        </span>
      )}
      {config.key === '0' && (
        <span className="text-xs mt-1 opacity-70">SPACE</span>
      )}
      {config.key === '1' && (
        <span className="text-xs mt-1 opacity-70">.,&apos;-</span>
      )}
    </div>
  );
}

interface PredictionChipProps {
  word: string;
  onSelect: () => void;
}

function PredictionChip({ word, onSelect }: PredictionChipProps) {
  const { ref, focused } = useFocusable({
    onEnterPress: onSelect,
  });

  return (
    <div
      ref={ref}
      onClick={onSelect}
      className={`
        px-4 py-2 rounded-full cursor-pointer
        transition-all duration-150
        ${focused
          ? 'bg-blue-500 text-white scale-105'
          : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
        }
      `}
    >
      <span className="text-lg">{word}</span>
    </div>
  );
}

export function PredictiveKeyboard({ onTextChange, initialText = '' }: PredictiveKeyboardProps) {
  const [text, setText] = useState(initialText);
  const [numericSequence, setNumericSequence] = useState('');
  const [predictions, setPredictions] = useState<string[]>([]);
  const [currentWordStart, setCurrentWordStart] = useState(0);

  const { ref, focusKey } = useFocusable({
    focusable: false,
    saveLastFocusedChild: true,
    trackChildren: true,
    preferredChildFocusKey: 'key-5',
  });

  // Update predictions when numeric sequence changes
  useEffect(() => {
    if (numericSequence) {
      const preds = getPredictions(numericSequence, 5);
      setPredictions(preds);
    } else {
      setPredictions([]);
    }
  }, [numericSequence]);

  // Notify parent of text changes
  useEffect(() => {
    onTextChange(text);
  }, [text, onTextChange]);

  const handleKeyPress = useCallback((config: KeyConfig) => {
    if (config.key === 'del') {
      // Delete last character
      if (text.length > 0) {
        const newText = text.slice(0, -1);
        setText(newText);

        // Update numeric sequence
        if (numericSequence.length > 0) {
          setNumericSequence(numericSequence.slice(0, -1));
        } else {
          // Find the start of the previous word
          const lastSpace = newText.lastIndexOf(' ');
          setCurrentWordStart(lastSpace + 1);
        }
      }
    } else if (config.key === 'lang') {
      // Language switch - placeholder for future implementation
      console.log('Language switch pressed');
    } else if (config.key === '0') {
      // Space - confirm current word and add space
      if (predictions.length > 0 && numericSequence) {
        // Auto-select first prediction
        const selectedWord = predictions[0];
        const beforeWord = text.slice(0, currentWordStart);
        setText(beforeWord + selectedWord + ' ');
      } else {
        setText(text + ' ');
      }
      setNumericSequence('');
      setCurrentWordStart(text.length + 1);
      setPredictions([]);
    } else if (config.type === 'letter') {
      // Letter key - add to numeric sequence
      const newSequence = numericSequence + config.key;
      setNumericSequence(newSequence);

      // Show first prediction as current typing
      const newPredictions = getPredictions(newSequence, 5);
      if (newPredictions.length > 0) {
        const beforeWord = text.slice(0, currentWordStart);
        setText(beforeWord + newPredictions[0]);
      } else {
        // No prediction, show first letter
        setText(text + config.chars[0]);
      }
    } else if (config.key === '1') {
      // Punctuation
      setText(text + '.');
      setNumericSequence('');
      setCurrentWordStart(text.length + 1);
    }
  }, [text, numericSequence, predictions, currentWordStart]);

  const handlePredictionSelect = useCallback((word: string) => {
    const beforeWord = text.slice(0, currentWordStart);
    setText(beforeWord + word + ' ');
    setNumericSequence('');
    setCurrentWordStart(beforeWord.length + word.length + 1);
    setPredictions([]);
  }, [text, currentWordStart]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="flex flex-col gap-4">
        {/* Text Display */}
        <div className="bg-gray-900 rounded-lg p-4 min-h-[60px]">
          <p className="text-2xl text-white">
            {text}
            <span className="animate-pulse">|</span>
          </p>
        </div>

        {/* Predictions */}
        <div className="flex gap-2 min-h-[44px] flex-wrap">
          {predictions.map((word, index) => (
            <PredictionChip
              key={`${word}-${index}`}
              word={word}
              onSelect={() => handlePredictionSelect(word)}
            />
          ))}
        </div>

        {/* Keyboard Grid */}
        <div className="flex flex-col gap-2">
          {KEYBOARD_LAYOUT.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2 justify-center">
              {row.map((keyConfig) => (
                <KeyButton
                  key={keyConfig.key}
                  config={keyConfig}
                  onPress={() => handleKeyPress(keyConfig)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </FocusContext.Provider>
  );
}

export default PredictiveKeyboard;
