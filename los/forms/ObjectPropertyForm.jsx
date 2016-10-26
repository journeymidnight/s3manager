import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import { extendContext } from '../../console-common/redux/actions';
import * as ObjectActions from '../redux/actions.object';

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
    const initialValues = { acl: 'private' };
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
          const url = s3.getSignedUrl('getObject', {
            Bucket: params.bucketName,
            Key: context.objectName,
          });
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

    return (
      <form className="form-horizontal">
        <div className="modal-body">

          <div className="form-group">
            <label className="control-label" >{t('objectPropertyPage.acl')}</label>
            <div className="col-sm-10">
              <strong style={{ padding: 6, display: 'block' }}>{this.acl[context.objectAcl] || ''}</strong>
            </div>
          </div>

          <div className="form-group">
            <label className="control-label" />
            <div className="col-sm-8">
              <select className="form-control" {...acl}>
                <option key="private" value="private">
                  {t('pageBucketCreate.aclPrivate')}
                </option>

                <option key="public-read" value="public-read">
                  {t('pageBucketCreate.aclPublicR')}
                </option>
              </select>
            </div>
            <div className="col-sm-2">
              <button
                type="button"
                className="btn btn-success"
                onClick={() => this.onPutAcl(acl.value)}
              >
                {t('objectPropertyPage.update')}
              </button>
            </div>
          </div>

          {!context.objectUrl && <div className="form-group">
            <label className="control-label" >{t('objectPropertyPage.period')}</label>
            <div className="col-sm-8">
              <input type="number" className="form-control" {...period} placeholder={t('objectPropertyPage.second')} />
            </div>
            <div className="col-sm-2">
              <button
                type="button"
                className="btn btn-success"
                onClick={() => this.onAuthorize(period.value)}
              >
                {t('objectPropertyPage.authorize')}
              </button>
            </div>
          </div>}

          {context.objectUrl && <div className="form-group">
            <label className="control-label" >{t('objectPropertyPage.url')}</label>
            <div className="col-sm-10">
              <strong style={{ padding: 6, display: 'block', wordBreak: 'break-word' }}>{context.objectUrl || ''}</strong>
            </div>
          </div>}
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
