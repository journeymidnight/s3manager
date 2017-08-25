//import React from 'react';
//
//const SelectInput = (props) => {
//  const {
//    item,
//    itemName,
//    optionList,
//    optionValue,
//    optionText,
//    helpText,
//    t,
//  } = props;
//
//  return (
//    <div className={'form-group'}>
//      <label className="control-label" >{t(itemName)}</label>
//      <div className="col-sm-10">
//        <select className="form-control form-control-md" {...item}>
//          {optionList && optionList.map((option) => {
//            return (
//              <option key={option[optionValue]} value={option[optionValue]}>
//                {t(option[optionText]) || option[optionValue]}
//              </option>
//            );
//          })}
//        </select>
//    {helpText && <p className="help-block">{t(helpText).split('\n').map((line) =>
//      <span key={Math.random()}>{line}<br /></span>
//    )}</p>}
//      </div>
//    </div>
//  );
//};
//
//SelectInput.propTypes = {
//  item: React.PropTypes.object.isRequired,
//  itemName: React.PropTypes.string.isRequired,
//  optionList: React.PropTypes.array,
//  optionValue: React.PropTypes.string.isRequired,
//  optionText: React.PropTypes.string,
//  helpText: React.PropTypes.string,
//  t: React.PropTypes.any.isRequired,
//};
//
//export default SelectInput;
//

import React from 'react';
import { Row, Col, Select } from '../../../lecloud-design';

const SelectInput = (props) => {
  const {
    item,
    itemName,
    optionList,
    optionValue,
    helpText,
    t,
    onChange,
  } = props;

  return (
    <Row gutter={20} className={'form-group'}>
      <Col span={3} className="control-label">
        <label>{t(itemName)}</label>
      </Col>
      <Col span={9}>
        <Select
          options={optionList}
          defaultWord={optionValue}
          {...item}
          onChange={onChange || item.onChange}
        />
        {helpText && <p className="help-block">{t(helpText).split('\n').map((line) =>
          <span key={Math.random()}>{line}<br /></span>
        )}</p>}
      </Col>
    </Row>

  );
};

SelectInput.propTypes = {
  item: React.PropTypes.object,
  itemName: React.PropTypes.string.isRequired,
  optionList: React.PropTypes.array,
  optionValue: React.PropTypes.string,
  helpText: React.PropTypes.string,
  t: React.PropTypes.any.isRequired,
  onChange: React.PropTypes.func,
};

export default SelectInput;
