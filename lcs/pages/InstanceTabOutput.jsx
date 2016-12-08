import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import * as Actions from '../../console-common/redux/actions';
import * as InstanceActions from '../redux/actions.instance';

class C extends Page {

  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
    this.download = this.download.bind(this);
    this.state = {
      outputDownloadUrl: undefined,
    };
  }

  initialize() {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('instanceManage'), `${servicePath}/instances`));

    this.refresh();
  }

  download(e) {
    if (e) {
      e.preventDefault();
    }

    this.setState({
      outputDownloadUrl: this.props.context.url,
    });

    setTimeout(() => {
      this.setState({
        outputDownloadUrl: undefined,
      });
    }, 100);
  }

  refresh(e) {
    if (e) {
      e.preventDefault();
    }

    const { routerKey, dispatch, region, params } = this.props;
    dispatch(InstanceActions.requestInstanceOutput(routerKey, region.regionId, params.instanceId))
    .then(() => {
      dispatch(Actions.extendContext({ loading: false }, routerKey));
    });

    dispatch(Actions.extendContext({ loading: true }, routerKey));
  }

  render() {
    const { t } = this.props;
    const { outputDownloadUrl } = this.state;
    return (
      <div>
        <div className="gray-content-block second-block">
          <div className="filter-item inline">
            <a className="btn btn-default" onClick={this.refresh}>
              <i className={`fa fa-refresh ${this.props.context.loading ? 'fa-spin' : ''}`}></i>
            </a>
          </div>
          {this.props.context.output && this.props.context.url && <div className="filter-item inline pull-right">
            <a className="btn btn-success" onClick={this.download}>
              <i className="fa fa-download"></i>&nbsp;{t('download')}
            </a>
          </div>}
          <iframe className="hide" src={outputDownloadUrl} />
        </div>
        {this.props.context.output && (
          <div>
            <pre className="console_output">
              {this.props.context.output}
            </pre>
          </div>
        )}
      </div>
    );
  }
}

export default attach(C);
