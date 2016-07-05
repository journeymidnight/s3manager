import React from 'react';
import { translate } from 'react-i18next';

const C = (props) => {
  return (
    <div className="dropdown inline prepend-left-10">
      <button className="dropdown-toggle btn" data-toggle="dropdown" type="button">
        <span className="light"></span> {props.isReverse ? props.t('lastCreated') : props.t('firstCreated')}
        <b className="caret"></b></button>
      <ul className="dropdown-menu dropdown-menu-align-right dropdown-select dropdown-menu-selectable">
        <li><a className={props.isReverse ? 'is-active' : ''} href onClick={props.onRefresh({ reverse: true })}>{props.t('lastCreated')}</a></li>
        <li><a className={props.isReverse ? '' : 'is-active'} href onClick={props.onRefresh({ reverse: false })}>{props.t('firstCreated')}</a></li>
      </ul>
    </div>
  );
};

C.propTypes = {
  isReverse: React.PropTypes.any,
  onRefresh: React.PropTypes.func,
  t: React.PropTypes.any,
};

export default translate()(C);
