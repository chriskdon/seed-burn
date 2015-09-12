var config = require('../shared/app-config');

var HelloMessage = React.createClass({
  render: function() {
    return <h1>Hello World from {this.props.name}</h1>;
  }
});

React.render(
  <HelloMessage name={config.name} />,
  document.getElementById('react-main')
);
