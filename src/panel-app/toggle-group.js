import React from "react";
import ToggleOption from "./toggle-option";

export default function ToggleGroup(props) {
  const { name, onChange, value, children, ...rest } = props;

  return (
    <fieldset {...rest}>
      {React.Children.map(children, child => {
        return child.type === ToggleOption
          ? React.cloneElement(child, {
              onChange,
              name,
              checked: child.props.value === value
            })
          : child;
      })}
    </fieldset>
  );
}
