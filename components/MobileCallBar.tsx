"use client";

/**
 * Call and Get a Quote, within thumb reach on phones and tablets. It
 * steps aside while someone is typing, so it can't cover a form field
 * or ride on top of the on-screen keyboard.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { client } from "@/client.config";
import { PhoneIcon } from "./icons";
import { isTextEntry, quoteHref } from "@/lib/mobileBar";
import { phoneHref } from "@/lib/phone";

export function MobileCallBar() {
  const pathname = usePathname();
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      const el = e.target as HTMLInputElement | null;
      setTyping(isTextEntry(el?.tagName, el?.type));
    };
    const onFocusOut = () => setTyping(false);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  const href = quoteHref(pathname);
  const label = client.mobileBar.quote;

  return (
    <div className={`mobile-call-bar ${typing ? "is-hidden" : ""}`}>
      <a href={phoneHref} className="mobile-call" tabIndex={typing ? -1 : undefined}>
        <PhoneIcon className="mobile-call-icon" />
        {client.mobileBar.call}
      </a>
      {href.startsWith("#") ? (
        <a href={href} className="mobile-quote" tabIndex={typing ? -1 : undefined}>
          {label}
        </a>
      ) : (
        <Link href={href} className="mobile-quote" tabIndex={typing ? -1 : undefined}>
          {label}
        </Link>
      )}
    </div>
  );
}
