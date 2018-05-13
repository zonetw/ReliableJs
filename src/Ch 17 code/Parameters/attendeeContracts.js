var Conference = Conference || {};
Conference.attendeeContracts = function() {
  'use strict';
  
  var personalInfo = 'Conference.attendee.personalInfo',
      checkInManagement = 'Conference.attendee.checkInManagement';
  
  return {
    getContracts: function getContracts() {
      
      function fulfillsPersonalInfo(att) {
        return typeof att.setId === 'function' &&
               typeof att.getId === 'function' &&
               typeof att.getFullName === 'function';
      }
        
      function fulfillsCheckInManagement(att) {
        return typeof att.getId === 'function' &&
               typeof att.isCheckedIn === 'function' &&
               typeof att.checkIn === 'function' &&
               typeof att.undoCheckIn === 'function' &&
               typeof att.setCheckInNumber === 'function' &&
               typeof att.getCheckInNumber === 'function';  
      }
      return [
        { name: personalInfo,      
          evaluator: fulfillsPersonalInfo },
          
        { name: checkInManagement, 
          evaluator: fulfillsCheckInManagement },
      ];
    },
    
    attachValidators: function attachValidators(registry) {
      
      // Attach validators to Conference.attendee(firstName,lastName)
      var funcName = 'attendee';
      registry.attachArgumentsValidator(funcName, Conference,
          [ 'undefined',          // No names supplied (OK)
            'string',             // Just one name supplied
            'string,string']);   // Both names supplied.
      registry.attachReturnValidator(funcName,Conference,personalInfo);
      registry.attachReturnValidator(funcName,Conference,checkInManagement);
       
      // Use an aspect on the return value from 
      // Conference.attendee(firstName,lastName).
      //  This return value happens to be an object literal.
      Aop.around(funcName,     
        function attachAspectsToAttendeeObjectLiteral(targetInfo) {
          // Instance of an attendee returned from the attendee function.
          var instance = Aop.next(targetInfo);
          
          registry.attachArgumentsValidator(
                          'setId',instance, 'undefined');
          registry.attachReturnValidator(
                         'setId',instance, 'nonNegativeInteger');
          
          registry.attachReturnValidator(
                          'getId',instance, 'nonNegativeInteger');
          
          registry.attachReturnValidator(
                          'getFullName',instance, 'string');
          
          registry.attachReturnValidator(
                          'isCheckedIn',instance, 'boolean');
          
          registry.attachReturnValidator(
                          'checkIn',instance, 'undefined');
          
          registry.attachReturnValidator(
                          'undoCheckIn',instance, 'undefined');
          
          registry.attachArgumentsValidator(
                          'setCheckInNumber',instance, 'nonNegativeInteger');
          registry.attachReturnValidator(
                          'setCheckInNumber',instance, 'undefined');
          
          registry.attachReturnValidator(
                          'getCheckInNumber',instance, 'nonNegativeInteger');
                          
          return instance;
        }, Conference);
    }
  };
};
