var React                 = require('react');
var Reply                 = require('./Reply');
var ReplyEditor           = require('./ReplyEditor');
var CommentActionCreator  = require('../../actions/CommentActionCreator');
var pluralize             = require('pluralize');
var moment                = require('moment');

var Comment = React.createClass({

  displayName: 'Comment',

  propTypes: {
    course_id:    React.PropTypes.number.isRequired,
    lecture_id:   React.PropTypes.number.isRequired,
    comment:      React.PropTypes.shape({
      id:           React.PropTypes.number,
      author:       React.PropTypes.shape({
        first_name:   React.PropTypes.string,
        last_name:    React.PropTypes.string,
      }),
      date_posted:  React.PropTypes.instanceOf(Date),
      content:      React.PropTypes.string,
      time:         React.PropTypes.number,
      replies:      React.PropTypes.array,
    }).isRequired,
    isReplying:   React.PropTypes.bool,
    onBeginReply: React.PropTypes.func,
    onEndReply:   React.PropTypes.func,
  },

  getInitialState: function() {
    return ({ repliesVisible: false });
  },

  /*============================== @HANDLING ==============================*/

  handleTimestampClick: function() {
    // TODO : Call an ActionCreator for seeking to the specific time
  },

  handleToggleRepliesClick: function() {
    this.setState({repliesVisible: !this.state.repliesVisible});
  },

  handleReplyClick: function() {
    this.props.onBeginReply(this.props.comment.id);
  },

  handleCancelReply: function() {
    this.props.onEndReply();
  },

  handleSubmitReply: function(content) {
    CommentActionCreator.createReply(
      this.props.course_id, this.props.lecture_id,
      this.props.comment, content
    );
    if(!this.state.repliesVisible) {
      this.setState({repliesVisible: true});
    }
    this.props.onEndReply();
  },

  /*============================== @FORMATTING ==============================*/

  getFormattedAuthorName: function() {
    return  this.props.comment.author.first_name + ' ' +
            this.props.comment.author.last_name;
  },

  getFormattedDatePosted: function() {
    return moment(this.props.comment.date_posted).fromNow();
  },

  getFormattedTimestamp: function(timestamp) {
    var hours   = parseInt(timestamp / 3600) % 24;
    var minutes = parseInt(timestamp / 60) % 60;
    var seconds = parseInt(timestamp) % 60;
    return  (hours < 10 ? "0" + hours : hours) + ":" +
            (minutes < 10 ? "0" + minutes : minutes) + ":" +
            (seconds  < 10 ? "0" + seconds : seconds);
  },

  /*============================== @RENDERING ==============================*/

  render: function() {
    return (
      <div className='comment'>
        <div className='comment-header'>
          <h4 className='comment__author'>{this.getFormattedAuthorName()}</h4>
          <h4 className='comment__date'>{this.getFormattedDatePosted()}</h4>
        </div>
        <p className='comment__content'>
           {this.renderTimestamp()} {this.props.comment.content}
        </p>
        {this.renderToggleRepliesButton()}
        {this.renderRepliesList()}
        {this.renderReplyButton()}
        {this.renderReplyEditor()}
      </div>
    );
  },

  renderTimestamp: function() {
    return (
      <span className='comment__timestamp' onClick={this.handleTimestampClick}>
        {this.getFormattedTimestamp(this.props.comment.time)}
      </span>
    );
  },

  renderReplyButton: function() {
    return (
      !this.props.isReplying ?
      <button className='comment__reply-button' onClick={this.handleReplyClick}>
        Reply
      </button> : ''
    );
  },

  renderReplyEditor: function() {
    return (
      this.props.isReplying ?
      <ReplyEditor
        onSubmit={this.handleSubmitReply}
        onCancel={this.handleCancelReply}/> : ''
    );
  },

  renderToggleRepliesButton: function() {
    var toggleRepliesButton;
    var n = this.props.comment.replies.length;
    if(n > 0) {
      var className = (this.state.repliesVisible) ?
        'comment__toggle-replies-button open' :
        'comment__toggle-replies-button closed';
      toggleRepliesButton =
        <button className={className} onClick={this.handleToggleRepliesClick}>
          {n} {pluralize('Reply', n)}
        </button>;
    }
    return toggleRepliesButton;
  },

  renderRepliesList: function() {
    var replies = this.props.comment.replies.map(function(reply, i) {
      return <li key={i}><Reply reply={reply}/></li>
    });
    var repliesListStyle = (this.state.repliesVisible) ?
      'comment__replies-list show' :
      'comment__replies-list hide';
    return (
      <ol className={repliesListStyle}>
        {replies}
      </ol>
    );
  }
});

module.exports = Comment;
