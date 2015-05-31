(function() {
  var $, instance, root,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.JqueryDebug = (function() {
    function JqueryDebug(options) {
      this.alert = bind(this.alert, this);
      this.info = bind(this.info, this);
      this.error = bind(this.error, this);
      this.debug = bind(this.debug, this);
      this.log = bind(this.log, this);
      this._log = bind(this._log, this);
      this.isProduction = bind(this.isProduction, this);
      this.isDevelopment = bind(this.isDevelopment, this);
      this.setDebugMode = bind(this.setDebugMode, this);
      this.isEnabled = bind(this.isEnabled, this);
      this.disable = bind(this.disable, this);
      this.enable = bind(this.enable, this);
      this.autodetectDebugModeAndSet = bind(this.autodetectDebugModeAndSet, this);
      this.config = bind(this.config, this);
      this.options = {
        cookieName: 'debug',
        urlParam: 'debug',
        developmentHosts: ['127.0', '192.168', 'localhost']
      };
      this.config(options);
      this.href = window.location.href;
      this.console = console;
      this.autodetectDebugModeAndSet();
    }

    JqueryDebug.prototype.config = function(options) {
      if (options) {
        this.options = $.extend(this.options, options);
      }
      return this.options;
    };

    JqueryDebug.prototype.autodetectDebugModeAndSet = function() {
      var ref, ref1;
      if ((ref = jQuery.url("?" + this.options.urlParam)) === '0' || ref === '1' || ref === 'true' || ref === 'false') {
        this.setDebugMode(jQuery.url("?" + this.options.urlParam));
        return;
      }
      if ((ref1 = jQuery.cookie(this.options.cookieName)) === '0' || ref1 === '1' || ref1 === 'true' || ref1 === 'false') {
        this.setDebugMode(jQuery.cookie(this.options.cookieName));
        return;
      }
      return this.setDebugMode(!this.isProduction());
    };

    JqueryDebug.prototype.enable = function() {
      return this.setDebugMode(true);
    };

    JqueryDebug.prototype.disable = function() {
      return this.setDebugMode(false);
    };

    JqueryDebug.prototype.isEnabled = function() {
      return this.debugEnabled;
    };

    JqueryDebug.prototype.setDebugMode = function(state) {
      if (state === 'true' || state === '1' || state === 1 || state === true) {
        this.debugEnabled = true;
      }
      if (state === 'false' || state === '0' || state === 0 || state === false) {
        this.debugEnabled = false;
      }
      return jQuery.cookie(this.options.cookieName, this.debugEnabled);
    };

    JqueryDebug.prototype.isDevelopment = function() {
      var host, i, len, ref;
      if (this.href.indexOf('file://') > -1) {
        return true;
      }
      ref = this.options.developmentHosts;
      for (i = 0, len = ref.length; i < len; i++) {
        host = ref[i];
        if (this.href.indexOf(host) > -1) {
          return true;
        }
      }
      return false;
    };

    JqueryDebug.prototype.isProduction = function() {
      return !this.isDevelopment();
    };

    JqueryDebug.prototype._log = function(type, args) {
      var err;
      if (!this.debugEnabled) {
        return;
      }
      try {
        return this.console[type].apply(this.console, args);
      } catch (_error) {
        err = _error;
        return this.alert(args.join(' '));
      }
    };

    JqueryDebug.prototype.log = function() {
      return this._log('log', arguments);
    };

    JqueryDebug.prototype.debug = function() {
      return this._log('debug', arguments);
    };

    JqueryDebug.prototype.error = function() {
      return this._log('error', arguments);
    };

    JqueryDebug.prototype.info = function() {
      return this._log('info', arguments);
    };

    JqueryDebug.prototype.alert = function(msg) {
      if (this.debugEnabled) {
        return alert(msg);
      }
    };

    return JqueryDebug;

  })();

  if (typeof jQuery !== 'undefined') {
    instance = new JqueryDebug();
    $ = jQuery;
    $.extend({
      debug: function() {
        var ref;
        if (!arguments.length) {
          return instance.isEnabled();
        }
        if ((ref = arguments[0]) === 'true' || ref === 1 || ref === true || ref === 'false' || ref === 0 || ref === false) {
          return instance.setDebugMode(arguments[0]);
        } else {
          return instance.config(arguments[0]);
        }
      }
    });
    $.extend($.debug, instance);
    $.debug.instance = instance;
  }

}).call(this);
