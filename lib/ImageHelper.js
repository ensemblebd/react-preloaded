'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ImageCache = require('./ImageCache');

var _ImageCache2 = _interopRequireDefault(_ImageCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ImageHelper = {
    loadImage: function loadImage(url, options) {
        var image = _ImageCache2.default.get(url, options);

        return new Promise(function (resolve, reject) {
            var handleSuccess = function handleSuccess() {
                resolve(image);
            };
            var handleError = function handleError() {
                reject(new Error('failed to preload ' + url));
            };

            if (image.complete) {
                // image is loaded, go ahead and change the state

                if (image.naturalWidth && image.naturalHeight) {
                    // successful load
                    handleSuccess();
                } else {
                    // IE CACHED IMAGES RACE CONDITION
                    // -------------------------------
                    // IE11 sometimes reports cached images as image.complete,
                    // but naturalWidth and naturalHeight = 0.
                    // A few ms later it will get the dimensions correct,
                    // so check a few times before rejecting it.
                    var counter = 1;
                    var checkDimensions = setInterval(function () {
                        if (image.naturalWidth && image.naturalHeight) {
                            window.clearInterval(checkDimensions);
                            handleSuccess();
                        }
                        if (counter === 3) {
                            window.clearInterval(checkDimensions);
                            handleError();
                        }
                        counter += 1;
                    }, 50);
                }
            } else {
                image.addEventListener('load', handleSuccess, false);
                image.addEventListener('error', handleError, false);
            }
        });
    },
    loadImages: function loadImages(urls, options) {
        var _this = this;

        var promises = urls.map(function (url) {
            return _this.loadImage(url, options);
        });
        return Promise.all(promises);
    },


    // preload without caring about the result
    stuffImages: function stuffImages(urls, options) {
        _ImageCache2.default.stuff(urls, options);
    }
};

exports.default = ImageHelper;