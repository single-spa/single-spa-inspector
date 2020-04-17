import React from "react";
import { useCss } from "kremling";
import ToggleOption from "./toggle-option";

export default function ToggleGroup(props) {
  const { name, onChange, value, children, ...rest } = props;
  const styles = useCss(css);

  return (
    <fieldset {...styles} {...rest}>
      {/* div to fix Chrome not rendering fieldsets as flex containers */}
      <div>
        {React.Children.map(children, (child) => {
          return child.type === ToggleOption
            ? React.cloneElement(child, {
                onChange,
                name,
                checked: child.props.value === value,
              })
            : child;
        })}
      </div>
    </fieldset>
  );
}

const css = `
& fieldset {
  border: none;
  margin: 0;
  padding: var(--table-spacing);
}
& legend {
  color: var(--gray);
  float: left;
  font-size: .9rem;
  padding-right: 1rem;
}
`;
