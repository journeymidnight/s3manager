import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions';

class C extends React.Component {

  componentDidMount() {
    const { region, regions, dispatch, params } = this.props;

    if (!region) {
      if (params.regionId) {
        dispatch(Actions.requestConnectRegion(params.regionId));
      } else {
        const regionId = regions[0].regionId;
        dispatch(Actions.requestConnectRegion(regionId));
      }
    } else {
      const regionId = region.regionId;
      if (params.regionId && regionId !== params.regionId) {
        dispatch(Actions.selectRegion(null));
        dispatch(Actions.requestConnectRegion(params.regionId));
      } else {
        dispatch(push(`/${regionId}`));
      }
    }
  }

  render() {
    return (
      <div className="ld-container">
        <div className="ld-loading ld-page">
          <i></i>
          <span>...</span>
        </div>
      </div>
    );
  }
}

C.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  params: React.PropTypes.object,
  region: React.PropTypes.object,
  regions: React.PropTypes.array,
};

function mapStateToProps(state) {
  return {
    region: state.region,
    regions: state.regions,
  };
}

export default connect(mapStateToProps)(C);
