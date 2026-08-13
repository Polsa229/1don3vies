import { useEffect, useRef, useState } from 'react';

interface TypewriterSequenceItem {
  text: string;
  speed: number;
  pause: number;
}

/**
 * Typewriter effect that types out a sequence of strings once, then stops.
 * Each item is typed char-by-char, held for `pause` ms, then the next item starts.
 * After the last item, the cursor blinks indefinitely.
 */
export function useTypewriter(sequence: TypewriterSequenceItem[], startDelay: number = 500) {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let charIndex = 0;
    let itemIndex = 0;
    let mounted = true;

    function typeNextChar() {
      if (!mounted) return;

      if (itemIndex >= sequence.length) {
        setIsDone(true);
        return;
      }

      const item = sequence[itemIndex];

      if (charIndex < item.text.length) {
        setDisplayedText(item.text.slice(0, charIndex + 1));
        charIndex++;
        timeoutRef.current = setTimeout(typeNextChar, item.speed);
      } else {
        // Finished typing this item — pause, then move to next
        if (itemIndex < sequence.length - 1) {
          timeoutRef.current = setTimeout(() => {
            if (!mounted) return;
            itemIndex++;
            charIndex = 0;
            setCurrentIndex(itemIndex);
            // Brief pause before starting next text — erase and retype
            setDisplayedText('');
            timeoutRef.current = setTimeout(typeNextChar, 200);
          }, item.pause);
        } else {
          setIsDone(true);
        }
      }
    }

    timeoutRef.current = setTimeout(typeNextChar, startDelay);

    return () => {
      mounted = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { displayedText, isDone, currentIndex };
}
