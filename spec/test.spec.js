(function() {
  describe('jquery.debug', function() {
    beforeEach(function() {
      var $;
      $ = jQuery;
      return Cookies.set($.debug.options['cookieName'], '-1');
    });
    it('can be configured', function() {
      var hosts;
      expect($.debug.config().developmentHosts).toContain('localhost');
      expect($.debug.config().developmentHosts).not.toContain('customhost');
      hosts = $.debug.config().developmentHosts;
      hosts.push('customhost');
      $.debug({
        developmentHosts: hosts
      });
      expect($.debug.config().developmentHosts).toContain('localhost');
      return expect($.debug.config().developmentHosts).toContain('customhost');
    });
    return describe('debug mode detection', function() {
      var fn, fn1, fn2, fn3, fn4, host, i, j, k, l, len, len1, len2, len3, len4, m, ref, ref1, ref2, ref3, ref4, state;
      ref = ['false', '0'];
      fn = function(actualState) {
        return it("recognizes url param " + actualState, function() {
          spyOn($, "url").and.returnValue("" + actualState);
          $.debug._autodetectDebugModeAndSet();
          return expect($.debug()).not.toBeTruthy();
        });
      };
      for (i = 0, len = ref.length; i < len; i++) {
        state = ref[i];
        fn(state);
      }
      ref1 = ['true', '1'];
      fn1 = function(actualState) {
        return it("recognizes url param " + actualState, function() {
          spyOn($, "url").and.returnValue("" + actualState);
          $.debug._autodetectDebugModeAndSet();
          return expect($.debug()).toBeTruthy();
        });
      };
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        state = ref1[j];
        fn1(state);
      }
      ref2 = ['false', '0'];
      fn2 = function(actualState) {
        return it("recognizes cookie param " + actualState, function() {
          spyOn(Cookies, "get").and.returnValue("" + actualState);
          $.debug._autodetectDebugModeAndSet();
          return expect($.debug()).not.toBeTruthy();
        });
      };
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        state = ref2[k];
        fn2(state);
      }
      ref3 = ['true', '1'];
      fn3 = function(actualState) {
        return it("recognizes cookie param " + actualState, function() {
          spyOn(Cookies, "get").and.returnValue("" + actualState);
          $.debug._autodetectDebugModeAndSet();
          return expect($.debug()).toBeTruthy();
        });
      };
      for (l = 0, len3 = ref3.length; l < len3; l++) {
        state = ref3[l];
        fn3(state);
      }
      ref4 = ['localhost', '127.0.0.1', '192.168.0.2', 'file://my.html'];
      fn4 = function(actualHost) {
        return it("recognizes host " + actualHost + " as development host", function() {
          $.debug.instance._href = actualHost + "/foo/bar";
          $.debug._autodetectDebugModeAndSet();
          return expect($.debug()).toBeTruthy();
        });
      };
      for (m = 0, len4 = ref4.length; m < len4; m++) {
        host = ref4[m];
        fn4(host);
      }
      it("recognizes host www.github.com as production host", function() {
        $.debug.instance._href = "www.github.com/foo/bar";
        $.debug._autodetectDebugModeAndSet();
        return expect($.debug()).not.toBeTruthy();
      });
      it("logs to console in debug mode", function() {
        spyOn($.debug.instance._console, "log").and.callThrough();
        $.debug(true);
        expect($.debug()).toBeTruthy();
        $.debug.log('msg');
        return expect($.debug.instance._console.log).toHaveBeenCalled();
      });
      return it("doesnt log to console in debug mode", function() {
        spyOn($.debug.instance._console, "log").and.callThrough();
        $.debug(false);
        expect($.debug()).not.toBeTruthy();
        $.debug.log('msg');
        return expect($.debug.instance._console.log).not.toHaveBeenCalled();
      });
    });
  });

}).call(this);
