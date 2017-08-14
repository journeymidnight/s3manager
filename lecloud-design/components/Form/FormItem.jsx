import React, { PropTypes } from 'react';
import Row from '../Row';
import Col from '../Col';
import './Form.scss';

class FormItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { name, label, labelSpan, children, ...rest } = this.props;

    return (
      <Row className="formitem">
        <Col span={labelSpan}>
          <label
            htmlFor={name}
            className="formitem-label"
          >
            {label}
          </label>
        </Col>

        <Col span={12 - labelSpan}>
          {React.cloneElement(children, { ...rest })}
        </Col>
      </Row>
    );
  }
}

FormItem.defaultProps = {
  labelSpan: 3,
};

FormItem.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelSpan: PropTypes.number,
  children: PropTypes.node.isRequired,
};

export default FormItem;
