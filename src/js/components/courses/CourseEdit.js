var React                 = require('react');
var CourseActionCreator   = require('../../actions/CourseActionCreator');
var CourseStore          = require('../../stores/CourseStore');

var Modal                 = require('react-bootstrap').Modal;
var ModalTrigger          = require('react-bootstrap').ModalTrigger;
var Button                = require('react-bootstrap').Button;
var OverlayMixin          = require('react-bootstrap').OverlayMixin;

var CourseEdit = React.createClass({

  displayName: 'CourseEdit',

  mixins: [OverlayMixin],

  propTypes : {
    course_id:  React.PropTypes.number.isRequired
  },

  getDefaultProps : function() {
    return {
      course_id: 1
    };
  },

  getInitialState: function() {
  	return {
      isModalOpen: false,
  		isEditingInfo: false,
  		isEditingRoster: false,
      isUploadingCsv: false
  	};
  },

  /*============================== @LIFECYCLE ==============================*/

  componentDidMount : function() {
    this.contextDidChange(this.props);
  },

  componentWillReceiveProps : function(nextProps) {
    this.setState(this.getStateFromStores(nextProps));
    this.contextDidChange(nextProps);
  },

  getStateFromStores : function(props) {
    var course = CourseStore.getCourse(props.course_id);
    if(!course || course == null) {
      lecture = {
        id: null,
        department: null,
        course_number: null,
        section: null,
        term: null,
        year: null,
        description: null
      }
    }
    return { course: course };
  },

  contextDidChange : function(props) {
    CourseActionCreator.requestCourse(props.course_id);
  },

  /*============================== @HANDLING ==============================*/
  handleToggle: function() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },

	handleEditRosterClick: function() {
		this.setState({isEditingRoster: true});
	},

	handleSaveInformationClick: function() {
		this.setState({isEditingInfo: false});
	},

	handleSaveRosterClick: function() {
		this.setState({isEditingRoster: false});
	},

  handleUploadCsvClick: function() {
    this.setState({isUploadingCsv: !this.state.isUploadingCsv});
  },

  /*============================== @RENDERING ==============================*/

  render: function() {
    return (
      <a onClick={this.handleToggle}>Edit</a>
    )
  },

  renderOverlay: function() {
    if (!this.state.isModalOpen) {
      return <span/>;
    }

    var course = this.state.course;

    return (
      <Modal title='Course Edit' onRequestHide={this.handleToggle}>
        <div className='modal-body'>
          {this.renderRosterEditButton()} <br/><br/>
          <form>
                 Department <input type="text" name="course__deparment" value={course.department}/> <br/>
                 Number <input type="text" name="course__number" value={course.course_number}/>
                 Section <input type="text" name="course__section" value={course.section}/> <br/>
                 Term <input type="text" name="course__term" value={course.term}/>
                 Year <input type="text" name="course__year" value={course.year}/> <br/>
                 Description <br/> <textarea type="text" name="course__description" value={course.description}/> <br/>
          </form>
        </div>
        <div className='modal-footer'>
          <Button bsStyle='primary'>Save changes</Button>
          <Button onClick={this.handleToggle}>Close</Button>
        </div>
      </Modal>
    );
  },

  renderInfoEditButton: function(){
    if (this.state.isEditingInfo){
      return <button onClick={this.handleSaveInformationClick}> Save Information </button>;
    } else {
      return <button onClick={this.handleEditInformationClick}> Edit Information </button>;
    }
  },

  renderRosterEditButton: function() {
    if (this.state.isEditingRoster){
      return 	<div>
                {this.renderUploadCsvButton()} <br/>
                <button> Paste Email </button> <br/>
                <button onClick={this.handleSaveRosterClick}> Save Roster </button>
              </div>;
    } else {
      return <button onClick={this.handleEditRosterClick}> Edit Roster </button>;
    }
  },

  renderUploadCsvButton: function() {
    if (this.state.isUploadingCsv){
      return <span>
                <input type='file'/>
                <button onClick={this.handleUploadCsvClick}> Upload </button>
             </span>;
    } else {
      return <button onClick={this.handleUploadCsvClick}> Upload CSV File </button>;
    }
  }
});

module.exports = CourseEdit;
