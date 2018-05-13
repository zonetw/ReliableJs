var Conference = Conference || {};
Conference.attendeeWebApiDecorator = function(baseWebApi){
  'use strict';
  
  var self = this,
  
      // The records passed to the post function, 
      // whose calls are not yet resolved.
      pendingPosts = [],
      
      messages = {
        postPending: 'It appears that a post is pending for this attendee'
      };
      
  // Return the element of 'posts' that is for the attendee,
  // or -1 if there is no such element.
  function indexOfPostForSameAttendee(posts,attendee) {
    var ix;
    for (ix=0; ix<posts.length; ++ix) {
      if (posts[ix].isSamePersonAs(attendee)) {
        return ix;
      }
    }
    return -1;
  }
  
  return {
    
    post: function post(attendee) {
      if (indexOfPostForSameAttendee(pendingPosts, attendee) >=0 ) {
        return Promise.reject(new Error(messages.postPending));
      }
      
      pendingPosts.push(attendee);
      
      return baseWebApi.post(attendee);
    },
    
    getAll: function getAll() {
      return baseWebApi.getAll().then(function(records) {
        pendingPosts.forEach(function(pending) {
          var ix = indexOfPostForSameAttendee(records,pending);
          if (ix<0) {
            records.push(pending);
          }
        });
        return records;
      });
    },
    
    getMessages: function getMessages() {
      return messages;
    }
  };
};