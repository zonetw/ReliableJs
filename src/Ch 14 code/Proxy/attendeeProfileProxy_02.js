var Conference = Conference || {};

// Manage access to the profiles of the attendees in an array (attendees),
// fetching them from an attendeeProfileService (profileService),
// and pre-fetching up to prefetchLimit most popular based on accessCount.
Conference.attendeeProfileProxy = function(
attendees, profileService, prefetchLimit) {
  'use strict';
  
  var ix,
      prefetched = {};
  
  function prefetch(attendeeId) {
    prefetched[attendeeId] = profileService.getProfile(attendeeId);
  }
  
  if (prefetchLimit > attendees.length) {
    prefetchLimit = attendees.length;
  }
  
  for (ix=0; ix<prefetchLimit; ++ix) {
    prefetch(attendees[ix].attendeeId);
  }
};