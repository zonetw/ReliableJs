var Conference = Conference || {};

// Manage access to the profiles of the attendees in an array (attendees),
// fetching them from an attendeeProfileService (profileService),
// and pre-fetching up to prefetchLimit most popular based on accessCount.
Conference.attendeeProfileProxy = function(
attendees, profileService, prefetchLimit) {
  'use strict';
  
  var prefetched = {};
  
  function prefetch(attendeeId) {
    prefetched[attendeeId] = profileService.getProfile(attendeeId);
  }
  
  if (prefetchLimit > attendees.length) {
    prefetchLimit = attendees.length;
  }
  
  (function prefetchAll() {
    var ix,
        sortedAttendees = attendees.slice().sort(function byViews(a,b) {
          return (b.profileViews || 0) - (a.profileViews || 0);
        });
    for (ix=0; ix<prefetchLimit; ++ix) {
      prefetch(sortedAttendees[ix].attendeeId);
    }
  })();
  
  return {
    getProfile: function getProfile(attendeeId) {
      return prefetched[attendeeId] || profileService.getProfile(attendeeId);
    }
  };
};