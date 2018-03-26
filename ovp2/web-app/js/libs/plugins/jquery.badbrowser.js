define(function (require) {
    var $ = require('$'), badBrowser = {};

    badBrowser.badBrowser = function(){// Define a bad browser

        // since we haven't updated to latest version of the jQuery, detection of IE11 and Edge browser will fail.
        // For Edge browsers, we need to look for 'Edge/major.minor' value in userAgent string.
        // For IE11, 'rv:11.0'

        if($.browser.msie){
            completeVersion = (navigator.userAgent.substring(navigator.userAgent.indexOf('MSIE') + 5));
            version = completeVersion.substring(0,completeVersion.indexOf('.'));

            if(version <= 9.0)
                return true;

        }
        if($.browser.mozilla){
            if(navigator.userAgent.toLowerCase().indexOf('firefox') != -1){
                completeVersion = navigator.userAgent.substring(navigator.userAgent.toLowerCase().indexOf('firefox/') + 8);
                version = completeVersion.substring(0, completeVersion.indexOf('.'));
                if (version <= 38)
                    return true;
            }
        }

        if($.browser.webkit){
           if(navigator.userAgent.toLowerCase().indexOf('chrome') != -1) {
                completeVersion = navigator.userAgent.substring(navigator.userAgent.toLowerCase().indexOf('chrome/') + 7);
                version = completeVersion.substring(0,completeVersion.indexOf('.'));
                $.browser.safari = false;
                if (version <= 40)
                   return true;
            }else if (navigator.userAgent.toLowerCase().indexOf('safari') != -1) {
                completeVersion = navigator.userAgent.substring(navigator.userAgent.toLowerCase().indexOf('version/') + 8);
                version = completeVersion.substring(0,completeVersion.indexOf('.'));
                if (version <= 4)
                    return true;
            }
        }

        if($.browser.opera){
            completeVersion = navigator.userAgent.substring(navigator.userAgent.toLowerCase().indexOf('opera/') + 6);
            version = completeVersion.substring(0,completeVersion.indexOf('.'));
            if (version <= 11){
                return true;
            }
        }

        return false;

    }

    badBrowser.getBadBrowser = function(c_name)// Make cookie
    {
        if (document.cookie.length>0)
        {
            c_start=document.cookie.indexOf(c_name + "=");
            if (c_start!=-1)
            {
                c_start=c_start + c_name.length+1;
                c_end=document.cookie.indexOf(";",c_start);
                if (c_end==-1) c_end=document.cookie.length;
                return unescape(document.cookie.substring(c_start,c_end));
            }
        }
        return "";
    }

    badBrowser.setBadBrowser = function(c_name,value,expiredays)// Expire cookie
    {
        var exdate=new Date();
        exdate.setDate(exdate.getDate()+expiredays);
        document.cookie=c_name+ "=" +escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
    };

    badBrowser.check = function() {
        var contentHtml;
        if(badBrowser.badBrowser()){// Display Message
            contentHtml =
                '<div id="browser-warning-container" class="alert alert-danger alert-dismissable browser-warning">' +
                '<button class="close browser-warning-close" type="button" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                '<h1>Your browser is not supported because it is unsafe &amp; out-of-date.</h1>' +
                '<h2>We recommend using the latest version of your browser...</h2>' +
                '<ul class="list-inline browser-list">' +
                    '<li><a class="alert-link browser-link safari-link" href="http://www.apple.com/safari/" target="_safari">Safari</a></li>' +
                    '<li><a class="alert-link browser-link chrome-link" href="http://www.google.com/chrome/" target="_chrome">Chrome</a></li>' +
                    '<li><a class="alert-link browser-link firefox-link" href="http://www.firefox.com" target="_ff">Firefox</a></li>' +
                    '<li><a class="alert-link browser-link opera-link" href="http://www.opera.com" target="_opera">Opera</a></li>' +
                    '<li><a class="alert-link browser-link ie-link" href="http://windows.microsoft.com/en-us/internet-explorer/download-ie/" target="_ie">Internet Explorer</a></li>' +
                '</ul>' +
                '<h3>By closing this window, you acknowledge that your experience on Time Warner Cable will be severely degraded.</h3>' +
                '<button class="btn btn-danger btn-lg browser-warning-close" type="button" data-dismiss="alert" aria-label="Close">Close <span aria-hidden="true">&times;</span></button>' +
                '</div>';

            $('body').prepend(contentHtml);

            $('.browser-warning-close').click(function(){
                badBrowser.setBadBrowser('browserWarning','seen', 30);
                $('#browser-warning-container').slideUp('slow');
                return false;
            });
            return true; //is a bad browser
        } else {
            return false;
        }
    };

    return badBrowser;
});
