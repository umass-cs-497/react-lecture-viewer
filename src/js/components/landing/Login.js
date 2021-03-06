var React   = require('react');
var Auth    = require('../../utils/MockAuth');
var Router  = require('react-router');

var Login = React.createClass({

  mixins: [Router.Navigation, Router.State],

  componentDidMount: function(){
    if(localStorage.token != undefined) {
      this.transitionTo("/main");
    }
  },

  getInitialState: function() {
    return {
      email: "",
      password: "",
      error: false
    };
  },

  /*============================== @HANDLING ==============================*/

  handlePasswordChange: function(e) {
    this.setState({
      password: e.target.value
    });
  },

  handleEmailChange: function(e) {
    this.setState({
      email: e.target.value
    });
  },

  handleCreate: function(e){
    e.preventDefault();
    this.transitionTo('CreateAccount');
  },

  handleLogin: function (e) {
    var self = this;
    e.preventDefault();
    var nextPath = '/main';
    var email = this.refs.email.getDOMNode().value;
    var password = this.refs.pass.getDOMNode().value;
    Auth.login(email, password, function (loggedIn) {
      if(!loggedIn) {
        return this.setState({ error: true });
      }
      if(nextPath) {
        self.transitionTo(nextPath);
      } else {
        self.transitionTo('/main');
      }
    }.bind(this));
  },

  /*============================== @RENDERING ==============================*/

  render: function() {
    return(
      <div>
        {this.renderLoggedOutText()}
      	<input ref="email" placeholder="Email" value={this.state.email} onChange={this.handleEmailChange}/>
        <input type="password" ref="pass" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange}/>
        <button onClick={this.handleLogin}>Login</button>
        <button onClick={this.handleCreate}>Create Account</button>
      </div>
    );
  },

  renderLoggedOutText: function() {
    return this.getQuery().loggedOut ?
      <p>You are now logged out</p> : '';
  }
});

module.exports = Login;
