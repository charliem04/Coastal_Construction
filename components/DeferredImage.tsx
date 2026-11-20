"use client";

/**
 * A photo that isn't requested until it's about to scroll into view.
 *
 * Native loading="lazy" isn't enough for the home page's nine service
 * cards: on a slow phone connection Chrome starts lazy images up to
 * ~2500px ahead, so all nine (~700 KB) download alongside the hero photo
 * and slow it down. This waits for an IntersectionObserver instead.
 *
 * The box is sized by its container (the card's 4:3 aspect ratio), so
 * nothing shifts when the photo arrives. Without JavaScript, the
 * <noscript> copy shows the photo as usual.
 */
import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

export function DeferredImage(props: ImageProps & { alt: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return setShow(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (show) return <Image {...props} />;
  return (
    <span ref={ref} className="block h-full w-full">
      <noscript>
        <Image {...props} />
      </noscript>
    </span>
  );
}
