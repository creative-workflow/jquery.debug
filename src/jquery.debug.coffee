root = exports ? this

class root.JqueryDebug
  constructor: (options) ->
    @options =
      cookieName: 'debug'
      urlParam: 'debug'
      developmentHosts: [
        '127.0'
        '192.168'
        'localhost'
      ]
    @config(options)
    @href    = window.location.href
    @console = console
    @autodetectDebugModeAndSet()

  config: (options) =>
    @options = $.extend(@options, options) if options
    @options

  autodetectDebugModeAndSet: =>
    if jQuery.url("?#{@options.urlParam}") in ['0', '1', 'true', 'false']
      @setDebugMode jQuery.url("?#{@options.urlParam}")
      return

    if jQuery.cookie(@options.cookieName) in ['0', '1', 'true', 'false']
      @setDebugMode jQuery.cookie(@options.cookieName)
      return

    @setDebugMode !@isProduction()

  enable: =>
    @setDebugMode true

  disable: =>
    @setDebugMode false

  isEnabled: =>
    @debugEnabled

  setDebugMode: (state) =>
    @debugEnabled = true  if state in ['true', '1', 1, true]
    @debugEnabled = false if state in ['false', '0', 0, false]
    jQuery.cookie(@options.cookieName, @debugEnabled)

  isDevelopment: =>
    return true if @href.indexOf('file://') > -1
    for host in @options.developmentHosts
      return true if @href.indexOf(host) > -1
    false

  isProduction: =>
    !@isDevelopment()

  _log: (type, args)=>
    return if !@debugEnabled
    try
      @console[type].apply @console, args
    catch err
      @alert args.join(' ')

  log:   => @_log('log',   arguments)
  debug: => @_log('debug', arguments)
  error: => @_log('error', arguments)
  info:  => @_log('info',  arguments)

  alert: (msg) => alert msg if @debugEnabled

if typeof jQuery != 'undefined'
  instance = new JqueryDebug()
  $        = jQuery
  $.extend debug: ->
    return instance.isEnabled() unless arguments.length

    if arguments[0] in ['true', 1, true, 'false', 0, false]
      instance.setDebugMode arguments[0]
    else
      instance.config arguments[0]

  #for calling instance methods directly
  $.extend $.debug, instance

  #for test stubbing we need the real instance, the real this
  $.debug.instance = instance
