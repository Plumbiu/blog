import { useEffect, useRef } from 'react';
import styles from './useDivider.module.css';
import { throttle } from 'es-toolkit';
import { isMobileDevice } from './useIsMobileDevice';

interface UseDividerProps {
  // left side min width
  leftMinWidth?: number;
  // right side min width
  rightMinWidth?: number;
}

const MobileWidth = 640

function useDivider(options?: UseDividerProps) {
  const dividerRef = useRef<HTMLDivElement>(null);
  const initValue = useRef<number | null>(null);
  const isMobileRef = useRef<Boolean>(null);
  useEffect(() => {
    isMobileRef.current = window.innerWidth <= MobileWidth;
  }, []);
  return {
    init(previewDom: HTMLElement | null) {
      if (!previewDom || !previewDom.parentElement) {
        return;
      }
      let { leftMinWidth = 60, rightMinWidth = 60 } = options || {};
      rightMinWidth = previewDom.parentElement.clientWidth - rightMinWidth;

      const dividerDom = dividerRef.current;
      if (!dividerDom) {
        return;
      }
      const isMobileByUserAgent = isMobileDevice();
      const isMobileByWidthFn = () => isMobileRef.current;

      const onMouseDown = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        const isMobileByWidth = isMobileByWidthFn();
        document.body.style.cursor = isMobileByWidth
          ? 'ns-resize'
          : 'ew-resize';
        if (e instanceof MouseEvent) {
          initValue.current = isMobileByWidth ? e.clientY : e.clientX;
        } else {
          initValue.current = isMobileByWidth
            ? e.touches[0].clientY
            : e.touches[0].clientX;
        }
        dividerDom.classList.add(styles.active);
        if (isMobileByUserAgent) {
          document.addEventListener('touchmove', onMouseMove);
        } else {
          document.addEventListener('mousemove', onMouseMove);
        }
      };
      const onMouseMove = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        if (initValue.current == null) {
          return;
        }
        const isMobileByWidth = isMobileByWidthFn();
        let clientOffset: number | null = null;
        if (e instanceof TouchEvent) {
          clientOffset = isMobileByWidth
            ? e.touches[0].clientY
            : e.touches[0].clientX;
        } else {
          clientOffset = isMobileByWidth ? e.clientY : e.clientX;
        }
        const offset = clientOffset - initValue.current;
        const style = getComputedStyle(previewDom);

        const changeKey = isMobileByWidth ? 'height' : 'width';
        const initWidth = Number.parseFloat(style[changeKey]);
        const changeValue = initWidth + offset;
        if (changeValue <= leftMinWidth || changeValue > rightMinWidth) {
          return;
        }
        previewDom.style[changeKey] = changeValue + 'px';
        initValue.current = clientOffset;
      };
      const onMouseUp = () => {
        initValue.current = null;
        document.body.style.cursor = 'auto';
        dividerDom.classList.remove(styles.active);
        if (isMobileByUserAgent) {
          document.removeEventListener('touchmove', onMouseMove);
        } else {
          document.removeEventListener('mousemove', onMouseMove);
        }
      };
      const onSizeChange = throttle(() => {
        if (window.innerWidth <= MobileWidth) {
          isMobileRef.current = true;
          previewDom.style.width = 'auto';
        } else {
          isMobileRef.current = false;
          previewDom.style.height = 'auto';
        }
      }, 200);

      if (isMobileByUserAgent) {
        dividerDom.addEventListener('touchstart', onMouseDown);
        document.addEventListener('touchend', onMouseUp);
      } else {
        dividerDom.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);
      }
      window.addEventListener('resize', onSizeChange);

      return () => {
        if (isMobileByUserAgent) {
          dividerDom.removeEventListener('touchstart', onMouseDown);
          document.removeEventListener('touchend', onMouseUp);
        } else {
          dividerDom.removeEventListener('mousedown', onMouseDown);
          document.removeEventListener('mouseup', onMouseUp);
        }
        window.removeEventListener('resize', onSizeChange);
      };
    },
    node: <div ref={dividerRef} className={styles.divider} />,
  };
}

export default useDivider;
