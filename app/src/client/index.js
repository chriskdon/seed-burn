var _ = require('underscore');
var config = require('../shared/app-config');

var words = ["Hello", "World"];

var HelloMessage = React.createClass({
  render: function() {
    return <h1>{words.map(w => <div>{w}</div>)} From {this.props.name}</h1>;
  }
});

React.render(
  <HelloMessage name={config.name} />,
  document.getElementById('react-main')
);
