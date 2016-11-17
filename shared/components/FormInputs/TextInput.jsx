import React from 'react';

const TextInput = (props) => {
  const {
    item,
    item: {
      touched,
      error,
    },
    itemName,
    inputParams,
    helpText,
    submitFailed,
    t,
  } = props;

  return (
    <div className={(submitFailed || touched) && error ? 'form-group has-error' : 'form-group'}>
      <label className="control-label" >{t(itemName)}</label>
      <div className="col-sm-10">
        <input type="text" className="form-control" {...item} {...inputParams} />
        {(submitFailed || touched) && error && <div className="text-danger"><small>{error}</small></div>}
        {helpText && <p className="help-block">{t(helpText).split('\n').map((line) =>
          <span key={Math.random()}>{line}<br /></span>
        )}</p>}
      </div>
    </div>
  );
};

TextInput.propTypes = {
  item: React.PropTypes.object.isRequired,
  itemName: React.PropTypes.string.isRequired,
  inputParams: React.PropTypes.object,
  helpText: React.PropTypes.string,
  submitFailed: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

export default TextInput;
