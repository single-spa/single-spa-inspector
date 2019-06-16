import React from "react";
import { useCss } from "kremling";

export default function Button({ children, ...props }) {
  const scope = useCss(css);
  return (
    <button {...props} {...scope} className="button">
      {children}
    </button>
  );
}

const css = `
& .button {
  background: var(--blue);
  border: none;
  border-radius: 3px;
  color: #fff;
  font-size: .75rem;
  padding: .125rem .5rem;
  text-shadow: 0px 2px 4px rgba(0,0,0,.15);
  transition: all .15s ease-in-out;
}
& .button:hover,
& .button:focus {
  background: var(--blue-dark);
}
& .button:not(:first-of-type) {
  margin-left: .25rem;
}
& .button:disabled {
  background: var(--blue-light);
}
`;
