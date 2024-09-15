"use client"

import { useEffect, useRef } from "react";

const SetCookies = () => {
  const ref = useRef<HTMLInputElement>(null);

  /** Renew cookies from API responses when fetching and mutating data from the server to maintain
   * the valid CSRF token. A request is made to an API Route Handler to work with HttpOnly cookies.
   * It's a bit hacky, but it's the easiest thing to do so you don't have to complicate the server components nor mutation
   * nor data fetching functions to return a NextResponse with the updated cookies.
   * 
   * This component must be present on every page where the renewal is needed. The easiest way to achieve this is using
   * it on a component that is rendered on every page, like a header or so.
   * 
   * Perhaps another approach that takes advantage of the request already made is to retrieve the cookies and pass them
   * to this component. The key relies on having a client component, where the cookies are automatically set on
   * the browser. The thing is that there you'd be missing HttpOnly cookies that are not part of the API response.
   */
  useEffect(() => {
    ref.current?.click();
  }, []);

  return (
    <input
      type="hidden"
      ref={ref}
      onClick={async () => {
        await fetch("/api/renew-cookies", {
          method: "GET",
          cache: "no-store"
        })
      }}
    />
  )
}

export default SetCookies