describe('DiContainer', function() {
  var container;
  beforeEach(function(){
    container = new DiContainer();
  });
  describe('register(name,dependencies,func)',function() {
    
    it('throws if any argument is missing or the wrong type', function() {
      var badArgs = [
        // No args at all
        [],
        // Just the name
        ['Name'],
        // Just name and dependencies
        ['Name',['Dependency1','Dependency2']],
        // Missing the dependencies.
        // (Commercial frameworks support this, but DiContainer does not.)
        ['Name', function() {}],
        // Various examples of wrong types
        [1,['a','b'],function() {}],
        ['Name',[1,2], function() {}],
        ['Name',['a','b'], 'should be a function']
      ];   
      badArgs.forEach(function(args) {
        expect(function() {
          container.register.apply(container,args);
        }).toThrowError(container.messages.registerRequiresArgs);
      });
    });
  });
    
  describe('get(name)', function() {
    
    it('returns undefined if name was not registered', function() {
      expect(container.get('notDefined')).toBeUndefined();
    });
    
    it('returns the result of executing the registered function', function() {
      var name = 'MyName',
          returnFromRegisteredFunction = "something";
      container.register(name,[],function() {
        return returnFromRegisteredFunction;
      });
      expect(container.get(name)).toBe(returnFromRegisteredFunction);
    });
    
    it('supplies dependencies to the registered function', function() {
      var main = 'main',
          mainFunc,
          dep1 = 'dep1',
          dep2 = 'dep2';
      container.register(main,[dep1,dep2], function(dep1Func, dep2Func) {
        return function() {
          return dep1Func() + dep2Func();
        };
      });
      container.register(dep1,[],function() {
        return function() {
          return 1;
        };
      });
      container.register(dep2,[],function() {
        return function() {
          return 2;
        };
      });
      mainFunc = container.get(main);
      expect(mainFunc()).toBe(3);
    });
  
    it('supplies dependencies recursively', function() {
      var level1 = 'one',
          level2 = 'two',
          level3 = 'three',
          result = [];
      container.register(level1,[level2],function(level2func) {
        return function() {
          result.push(level1);
          level2func();
        };
      });
      container.register(level2,[level3],function(level3func) {
        return function() {
          result.push(level2);
          level3func();
        };
      });
      container.register(level3,[],function() {
        return function() {
          result.push(level3);
        };
      });
      
      container.get(level1)();
      expect(result).toEqual([level1,level2,level3]);
    });
  });
});
