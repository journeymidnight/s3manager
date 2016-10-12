import React from 'react';
import { Link } from 'react-router';

const C = (props, context) => {
  const isActive = context.router.isActive(props.to);
  const className = isActive ? 'active' : '';
  const link = (
    <Link to={props.to} onClick={props.onClick}>
    {props.children}
    </Link>
  );
  return <li className={className}>{link}</li>;
};

C.contextTypes = {
  router: React.PropTypes.any,
};

C.propTypes = {
  to: React.PropTypes.string,
  onClick: React.PropTypes.func,
  children: React.PropTypes.any,
};

export default C;
