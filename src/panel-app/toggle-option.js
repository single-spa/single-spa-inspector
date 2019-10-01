import React from "react";
import { useCss, always } from "kremling";

export default function ToggleOption(props) {
  const { children, checked, ...rest } = props;
  const styles = useCss(css);

  return (
    <label
      {...styles}
      className={always("toggle-option").maybe("active", checked)}
    >
      <input type="radio" {...rest} />
      {children}
    </label>
  );
}

const css = `
& .toggle-option {
  background: var(--blue);
  color: #fff;
  cursor: pointer;
  font-size: .75rem;
  margin-right: 2px;
  padding: .25rem 0.5rem .125rem;
  transition: background .15s ease-in-out;
}

& .toggle-option:focus-within {
  outline: 2px solid var(--blue-light);
}

& .toggle-option:first-of-type {
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}

& .toggle-option:last-of-type {
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
}

& .toggle-option.active {
  background: var(--blue-dark);
}

& .toggle-option input {
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: inset(50%);
  height: 1px;
  width: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
}
`;
