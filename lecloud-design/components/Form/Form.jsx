import React, { Children, cloneElement, PropTypes } from 'react';
import Row from '../Row';
import Col from '../Col';
import FormItem from './FormItem';
import './Form.scss';

class Form extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      key: Date.now(),
    };
    this.values = {};
    this.errors = {};
    this.inputs = null;

    this.onSubmit = this.onSubmit.bind(this);
    this.onReset = this.onReset.bind(this);
  }

  componentWillMount() {
    const { children } = this.props;

    this.inputs = Children.map(children, (input) => {
      if (!input) {
        return null;
      }
      if (input.props) {
        return cloneElement(input, {
          onChange: (value) => {
            this.values[input.props.name] = value;
          },
          onError: (isError) => {
            this.errors[input.props.name] = isError;
          },
        });
      }
      return null;
    });
  }

  onReset() {
    this.setState({
      key: Date.now(),
    });
  }

  onSubmit() {
    if (!Object.keys(this.errors).map(key => this.errors[key]).includes(true)) {
      this.props.onSubmit(this.values);
    }
  }

  render() {
    const { resetable, submitButtonText, resetButtonText } = this.props;

    return (
      <form key={this.state.key} className="form" onSubmit={this.onSubmit}>
        <div className="form-inputs">
          {this.inputs}
        </div>

        <div className="form-actions">
          <Row>
            <Col span={6}>
              {resetable && <button
                type="reset"
                className="button button-white"
                onClick={this.onReset}
              >
                {resetButtonText}
              </button>}
            </Col>

            <Col span={6}>
              <button
                className="button"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  this.onSubmit();
                }}
              >
                {submitButtonText}
              </button>
            </Col>
          </Row>
        </div>
      </form>
    );
  }
}

Form.Item = FormItem;

Form.defaultProps = {
  resetable: true,
  submitButtonText: 'Save',
  resetButtonText: 'Reset',
};

Form.propTypes = {
  resetable: PropTypes.bool,
  submitButtonText: PropTypes.string,
  resetButtonText: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default Form;
