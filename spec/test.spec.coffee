describe 'jquery.debug', ->
  beforeEach ->
    $ = jQuery
    $.cookie($.debug.options['cookieName'], '-1')

  describe 'debug mode detection', ->
    for state in ['false', '0']
      ((actualState)->
        it "recognizes url param #{actualState}", ->
          spyOn($, "url").and.returnValue "#{actualState}"
          $.debug._autodetectDebugModeAndSet()
          expect($.debug()).not.toBeTruthy()
      ) state

    for state in ['true', '1']
      ((actualState)->
        it "recognizes url param #{actualState}", ->
          spyOn($, "url").and.returnValue "#{actualState}"
          $.debug._autodetectDebugModeAndSet()
          expect($.debug()).toBeTruthy()
      ) state

    for state in ['false', '0']
      ((actualState)->
        it "recognizes cookie param #{actualState}", ->
          spyOn($, "cookie").and.returnValue "#{actualState}"
          $.debug._autodetectDebugModeAndSet()
          expect($.debug()).not.toBeTruthy()
      ) state

    for state in ['true', '1']
      ((actualState)->
        it "recognizes cookie param #{actualState}", ->
          spyOn($, "cookie").and.returnValue "#{actualState}"
          $.debug._autodetectDebugModeAndSet()
          expect($.debug()).toBeTruthy()
      ) state

    for host in ['localhost', '127.0.0.1', '192.168.0.2', 'file://my.html']
      ((actualHost)->
        it "recognizes host #{actualHost} as development host", ->
          $.debug.instance._href = "#{actualHost}/foo/bar"
          $.debug._autodetectDebugModeAndSet()
          expect($.debug()).toBeTruthy()
      ) host

    it "recognizes host www.github.com as production host", ->
      $.debug.instance._href = "www.github.com/foo/bar"
      $.debug._autodetectDebugModeAndSet()
      expect($.debug()).not.toBeTruthy()

    it "logs to console in debug mode", ->
      spyOn($.debug.instance._console, "log").and.callThrough()
      $.debug true
      expect($.debug()).toBeTruthy()
      $.debug.log 'msg'
      expect($.debug.instance._console.log).toHaveBeenCalled()

    it "doesnt log to console in debug mode", ->
      spyOn($.debug.instance._console, "log").and.callThrough()
      $.debug false
      expect($.debug()).not.toBeTruthy()
      $.debug.log 'msg'
      expect($.debug.instance._console.log).not.toHaveBeenCalled()
