import React from 'react';
import Slider from '../../components/Slider';

const SliderInput = (props) => {
  const {
    item,
    item: {
      value,
    },
    itemName,
    max,
    min,
    step,
    unit,
    helpText,
    t,
  } = props;

  return (
    <div className="form-group">
      <label className="control-label" >{t(itemName)}</label>
      <div className="col-sm-10">
        <input type="hidden" className="form-control" value={value} disabled="disabled" />
        <Slider min={min} max={max} step={step} value={value} unit={unit || ''} onChange={param => item.onChange(param)} />
        {helpText && <p className="help-block">{t(helpText).split('\n').map((line) =>
          <span key={Math.random()}>{line}<br /></span>
        )}</p>}
      </div>
    </div>
  );
};

SliderInput.propTypes = {
  item: React.PropTypes.object.isRequired,
  itemName: React.PropTypes.string.isRequired,
  max: React.PropTypes.number.isRequired,
  min: React.PropTypes.number.isRequired,
  step: React.PropTypes.number.isRequired,
  unit: React.PropTypes.string,
  inputParams: React.PropTypes.object,
  helpText: React.PropTypes.string,
  t: React.PropTypes.any,
};

export default SliderInput;
