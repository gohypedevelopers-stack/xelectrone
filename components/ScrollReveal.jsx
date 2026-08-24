import { Children, cloneElement, isValidElement, useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const renderWords = (text, keyPrefix) =>
  text.split(/(\s+)/).map((word, index) => {
    if (word.match(/^\s+$/)) return word;
    return (
      <span className="inline-block word" key={`${keyPrefix}-${index}`}>
        {word}
      </span>
    );
  });

const renderNodes = (node, keyPrefix = 'node') => {
  if (typeof node === 'string' || typeof node === 'number') {
    return renderWords(String(node), keyPrefix);
  }

  if (Array.isArray(node)) {
    return node.map((child, index) => (
      <span key={`${keyPrefix}-${index}`} className="contents">
        {renderNodes(child, `${keyPrefix}-${index}`)}
      </span>
    ));
  }

  if (isValidElement(node)) {
    const children = node.props?.children;

    return cloneElement(node, {
      ...node.props,
      children: children !== undefined ? renderNodes(children, `${keyPrefix}-c`) : children,
    });
  }

  return node;
};

const ScrollReveal = ({
  children,
  scrollContainerRef = null,
  enableBlur = true,
  baseOpacity = 0.15,
  baseRotation = 0,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom 40%',
  wordAnimationEnd = 'bottom 40%'
}) => {
  const containerRef = useRef(null);

  const splitText = useMemo(() => renderNodes(children), [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    const ctx = gsap.context(() => {
      const wordElements = el.querySelectorAll('.word');

      if (baseRotation !== 0) {
        gsap.fromTo(
          el,
          { transformOrigin: '0% 50%', rotate: baseRotation },
          {
            ease: 'none',
            rotate: 0,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top 85%',
              end: rotationEnd,
              scrub: 0.8
            }
          }
        );
      }

      if (wordElements.length > 0) {
        gsap.fromTo(
          wordElements,
          { opacity: baseOpacity, willChange: 'opacity, filter' },
          {
            ease: 'power1.out',
            opacity: 1,
            stagger: 0.04,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top 85%',
              end: wordAnimationEnd,
              scrub: 0.8
            }
          }
        );

        if (enableBlur) {
          gsap.fromTo(
            wordElements,
            { filter: `blur(${blurStrength}px)` },
            {
              ease: 'power1.out',
              filter: 'blur(0px)',
              stagger: 0.04,
              scrollTrigger: {
                trigger: el,
                scroller,
                start: 'top 85%',
                end: wordAnimationEnd,
                scrub: 0.8
              }
            }
          );
        }
      }
    }, containerRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <h2 ref={containerRef} className={`my-5 w-full ${containerClassName}`}>
      <p className={`block w-full text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] font-semibold ${textClassName}`}>{splitText}</p>
    </h2>
  );
};

export default ScrollReveal;

