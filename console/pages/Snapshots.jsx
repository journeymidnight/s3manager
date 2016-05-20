import React from 'react';
import RegionPage, { attach } from '../../shared/pages/RegionPage';

class C extends RegionPage {

  componentDidMount() {
  }

  render() {
    const { t } = this.props;
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <ul className="nav-links">
              <li className="home active">
                <a data-placement="right" href="#">{t('image')}</a></li>
              <li className="">
                <a data-placement="right" href="#">{t('volume')}</a></li>
            </ul>
            <div className="nav-block hidden">
              <div className="controls">
                <a className="btn btn-new" title="New Snippet" href="/snippets/new">
                  <i className="fa fa-plus"></i>New Snippet</a>
              </div>
              <div className="nav-links snippet-scope-menu">
                <li className="active">
                  <a href="/dashboard/snippets">All
                    <span className="badge">0</span></a>
                </li>
                <li>
                  <a href="/dashboard/snippets?scope=are_private">Private
                    <span className="badge">0</span></a>
                </li>
                <li>
                  <a href="/dashboard/snippets?scope=are_internal">Internal
                    <span className="badge">0</span></a>
                </li>
                <li>
                  <a href="/dashboard/snippets?scope=are_public">Public
                    <span className="badge">0</span></a>
                </li>
              </div>
            </div>
            <ul className="content-list">
              <li>
                <div className="nothing-here-block">{t('nothingHere')}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
