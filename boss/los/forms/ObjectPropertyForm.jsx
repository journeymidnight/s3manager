import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import { extendContext } from '../../redux/actions';
import * as ObjectActions from '../redux/actions.object';
import { Select, Row, Col } from '../../../lecloud-design';


class ObjectPropertyForm extends React.Component {

  constructor(props) {
    super(props);
    const { t } = this.props;

    this.acl = {
      private: t('objectPropertyPage.aclPrivate'),
      'public-read': t('objectPropertyPage.aclPublicR'),
    };

    this.onPutAcl = this.onPutAcl.bind(this);
    this.onAuthorize = this.onAuthorize.bind(this);
  }

  componentDidMount() {
    const initialValues = { acl: 'private', period: 0 };
    this.props.initializeForm(initialValues);
  }

  onPutAcl(acl) {
    const { dispatch, params, routerKey, context, s3 } = this.props;
    dispatch(ObjectActions.requestPutObjectAcl(s3, params.bucketName, context.objectName, acl))
      .then(() => {
        return dispatch(ObjectActions.requestGetObjectAcl(s3, params.bucketName, context.objectName, routerKey));
      })
      .then(() => {
        if (this.props.context.objectAcl === 'public-read') {
          const url = `http://${params.bucketName}.${context.s3Domain}/${encodeURIComponent(context.objectName)}`;
          dispatch(extendContext({ objectUrl: url }, routerKey));
        } else {
          dispatch(extendContext({ objectUrl: null }, routerKey));
        }
      });
  }

  onAuthorize(period) {
    const { dispatch, routerKey, params, context, s3 } = this.props;
    const url = s3.getSignedUrl('getObject', {
      Bucket: params.bucketName,
      Key: context.objectName,
      Expires: period,
    });
    dispatch(extendContext({ objectUrl: url }, routerKey));
  }

  render() {
    const { fields:
      { acl, period },
      t,
      context,
    } = this.props;

    const selectOptions = [
      {
        value: 'private',
        name: t('pageBucketCreate.aclPrivate'),
      },
      {
        value: 'public-read',
        name: t('pageBucketCreate.aclPublicR'),
      },
    ];

    return (
      <form className="form-horizontal">
        <div className="form-body">

          <Row gutter={20} className="form-group">
            <Col span={3} align="top" className="control-label-own">
              {t('objectPropertyPage.acl')}
            </Col>
            <Col span={9} align="top" className="form-control-own" style={{ padding: '4px 10px', height: 36 }}>
              <strong style={{ fontSize: 12 }}>{this.acl[context.objectAcl] || ''}</strong>
            </Col>
          </Row>

          <Row gutter={20} className="form-group">
            <Col span={3} align="top" className="control-label-own">
              {t('pageBucketCreate.acl')}
            </Col>
            <Col span={6} className="form-control-own">
              <Select
                options={selectOptions}
                defaultWord={context.objectAcl}
                onChange={(value) => {
                  acl.onChange(value);
                }}
              />
            </Col>
            <Col span={2}>
              <button
                type="button"
                className="button"
                onClick={() => this.onPutAcl(acl.value)}
                style={{ marginTop: 3}}
              >
                {t('objectPropertyPage.update')}
              </button>
            </Col>
          </Row>

          <Row gutter={20} className="form-group">
            <Col span={3} align="top" className="control-label-own">
              {t('objectPropertyPage.url')}
            </Col>
            <Col span={9} className="form-control-own" style={{ padding: '4px 10px', minHeight: 36, width: 370 }}>
              <strong style={{ fontSize: 12, wordBreak: 'break-word' }}>{context.objectUrl || t('objectPropertyPage.needAuthorize')}</strong>
            </Col>
          </Row>

          {context.objectAcl === 'private' && <Row gutter={20} className="form-group">
            <Col span={3} align="top" className="control-label-own">
              {t('objectPropertyPage.period')}
            </Col>
            <Col span={6} align="top" className="form-control-own">
              <input
                className="input"
                type="number"
                style={{ width: 245 }}
                min={1}
                max={10000}
                step={1}
                value={period.value}
                onChange={(value) => {
                  period.onChange(value);
                }}
                {...period}
              />
              <p className="help-block">{t('objectPropertyPage.second')}</p>
            </Col>
            <Col span={2} align="top">
              <button
                type="button"
                className="button"
                onClick={() => this.onAuthorize(period.value)}
                style={{ marginTop: 3 }}
                disabled={!period.value || period.value <= 0 || !Number.isInteger(period.value)}
              >
                {t('objectPropertyPage.authorize')}
              </button>
            </Col>
          </Row>}
        </div>
      </form>
    );
  }
}

ObjectPropertyForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  initializeForm: React.PropTypes.func.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  params: React.PropTypes.object.isRequired,
  routerKey: React.PropTypes.string.isRequired,
  context: React.PropTypes.object.isRequired,
  s3: React.PropTypes.object.isRequired,
  t: React.PropTypes.any,
};

export default reduxForm({
  form: 'ObjectPropertyForm',
  fields: ['acl', 'period'],
})(translate()(ObjectPropertyForm));
