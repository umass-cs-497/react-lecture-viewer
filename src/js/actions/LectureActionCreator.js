var Dispatcher      = require('../dispatchers/Dispatcher');
var ActionConstants = require('../constants/ActionConstants');
var API             = require('../utils/MockData');

var log = function(action, data) {
  console.log('[DISPATCHING] <' + action + '> ' + JSON.stringify(data));
}

var LectureActionCreator = {
  createLecture: function(course_id, tentativeLecture) {
    var lecture = API.createLecture(course_id, tentativeLecture);
    log('CREATE_LECTURE', lecture);
    Dispatcher.dispatch({
      actionType: ActionConstants.CREATE_LECTURE,
      course_id: course_id,
      lecture: lecture
    });
  },

  requestLectures: function(course_id) {
    var lectures = API.getLectures(course_id);
    log('REQUEST_LECTURES', lectures);
    Dispatcher.dispatch({
      actionType: ActionConstants.REQUEST_LECTURES,
      course_id: course_id,
      lectures: lectures
    });
  }
}

module.exports = LectureActionCreator;