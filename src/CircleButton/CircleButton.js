import React from 'react';
import PropTypes, { any } from 'prop-types';
import './CircleButton.css';

export default function NavCircleButton(props) {
  const { tag, className, children, ...otherProps } = props
console.log(children)
  return React.createElement(
    tag,
    {
      className: ['NavCircleButton', className].join(' '),
      ...otherProps
    },
    children
  )
}

NavCircleButton.defaultProps ={
  tag: 'a',
}

NavCircleButton.propTypes = {
  className: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  tag: any
}
