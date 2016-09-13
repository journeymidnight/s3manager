import React from 'react';

class SearchBox extends React.Component {
  render() {
    return (
      <div className="search-box">
        <input type="search" ref="search" placeholder={this.props.placeholder} onKeyPress={this.props.onEnterPress} />
        <button onClick={this.props.onButtonClick}><i className="fa fa-search" aria-hidden="true"></i></button>
      </div>
  );
  }
}

SearchBox.propTypes = {
  placeholder: React.PropTypes.string,
  t: React.PropTypes.func,
  onEnterPress: React.PropTypes.func,
  onButtonClick: React.PropTypes.func,
};

export default SearchBox;
