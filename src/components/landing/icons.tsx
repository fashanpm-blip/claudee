export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 355 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 12h34c16 0 26 9 26 23s-10 23-26 23H22v40H4V12zm18 15v16h13c7 0 11-3 11-8s-4-8-11-8H22z"
        fill="#fff"
      />
      <path
        d="M78 12h35c17 0 27 9 27 22 0 10-5 17-15 20l17 44h-20l-15-40H96v40H78V12zm18 15v16h15c7 0 11-3 11-8s-4-8-11-8H96z"
        fill="#fff"
      />
      <path
        d="M156 12h17l20 34 20-34h17v86h-18V44l-17 29h-4l-17-29v54h-18V12z"
        fill="#fff"
      />
      <path
        d="M245 12h34c16 0 26 9 26 23s-10 23-26 23h-16v40h-18V12zm18 15v16h13c7 0 11-3 11-8s-4-8-11-8h-13z"
        fill="#fff"
      />
      <path
        d="M296 12h58v16h-20v70h-18V28h-20V12z"
        fill="#fff"
      />
      <circle cx="337" cy="30" r="22.5" stroke="#fff" strokeWidth="2.5" />
      <path
        d="M328 19h11c5 0 9 3 9 8 0 3-2 6-5 7l6 10h-6l-5-9h-4v9h-6V19zm6 5v6h5c2 0 4-1 4-3s-2-3-4-3h-5z"
        fill="#fff"
      />
    </svg>
  );
}

export function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 14H40" stroke="#fff" strokeWidth="2.5" />
      <path d="M0 26H40" stroke="#fff" strokeWidth="2.5" />
    </svg>
  );
}

export function CursorGlyph() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22.75" stroke="#fff" strokeWidth="2.5" />
      <path
        d="M24 14c1.8 0 3.2 1.4 3.2 3.2 0 1.3-.8 2.4-1.9 2.9.9.6 1.5 1.7 1.5 2.9 0 1.9-1.6 3.5-3.5 3.5h-1.6v3.9h1.6c1.9 0 3.5 1.6 3.5 3.5s-1.6 3.5-3.5 3.5-3.5-1.6-3.5-3.5c0-1.3.7-2.4 1.8-3v-.1h-1.8v-3.9h1.8v-3.7h-1.8V19h1.8c-1.1-.5-1.9-1.6-1.9-2.9 0-1.8 1.4-3.2 3.2-3.2 0 0 .6.6 1.3 1.1z"
        fill="#fff"
      />
    </svg>
  );
}
