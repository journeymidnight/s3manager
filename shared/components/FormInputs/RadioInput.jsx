import React from 'react';
import { Row, Col, Radio } from '../../../lecloud-design';

const RadioInput = (props) => {
  const {
    item,
    itemName,
    optionList,
    optionValue,
    helpText,
    type,
    t,
    onChange,
  } = props;

  return (
    <Row gutter={20} className={'form-group'}>
      <Col span={3} className="control-label">
        <label>{t(itemName)}</label>
      </Col>
      <Col span={9}>
        <Radio
          options={optionList}
          defaultWord={optionValue}
          type={type}
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

RadioInput.propTypes = {
  item: React.PropTypes.object,
  itemName: React.PropTypes.string.isRequired,
  optionList: React.PropTypes.array,
  optionValue: React.PropTypes.string,
  helpText: React.PropTypes.string,
  type: React.PropTypes.string,
  t: React.PropTypes.any.isRequired,
  onChange: React.PropTypes.func,
};

export default RadioInput;
