'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ImageHelper = require('./ImageHelper');

var _ImageHelper2 = _interopRequireDefault(_ImageHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propTypes = {
    // Rendered on success
    children: _propTypes2.default.element.isRequired,

    // Rendered during load
    loadingIndicator: _propTypes2.default.node,

    // Array of image urls to be preloaded
    images: _propTypes2.default.array,

    // If set, the preloader will automatically show
    // the children content after this amount of time
    autoResolveDelay: _propTypes2.default.number,

    // Error callback. Is passed the error
    onError: _propTypes2.default.func,

    // Success callback
    onSuccess: _propTypes2.default.func,

    // Whether or not we should still show the content
    // even if there is a preloading error
    resolveOnError: _propTypes2.default.bool,

    // Whether or not we should mount the child content after
    // images have finished loading (or after autoResolveDelay)
    mountChildren: _propTypes2.default.bool
};

var defaultProps = {
    images: [],
    autoResolveDelay: 0,
    onError: null,
    onSuccess: null,
    resolveOnError: true,
    mountChildren: true,
    loadingIndicator: null
};

var Preload = function (_Component) {
    _inherits(Preload, _Component);

    function Preload(props) {
        _classCallCheck(this, Preload);

        var _this = _possibleConstructorReturn(this, (Preload.__proto__ || Object.getPrototypeOf(Preload)).call(this, props));

        _this.state = {
            ready: false
        };

        _this._handleSuccess = _this._handleSuccess.bind(_this);
        _this._handleError = _this._handleError.bind(_this);
        _this._mounted = false;
        return _this;
    }

    _createClass(Preload, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (!this.props.images || this.props.images.length === 0) {
                this._handleSuccess();
            }

            this._mounted = true;
            if (!this.state.ready) {
                _ImageHelper2.default.loadImages(this.props.images).then(this._handleSuccess, this._handleError);

                if (this.props.autoResolveDelay && this.props.autoResolveDelay > 0) {
                    this.autoResolveTimeout = setTimeout(this._handleSuccess, this.props.autoResolveDelay);
                }
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this._mounted = false;
            if (this.autoResolveTimeout) {
                clearTimeout(this.autoResolveTimeout);
            }
        }
    }, {
        key: '_handleSuccess',
        value: function _handleSuccess() {
            if (this.autoResolveTimeout) {
                clearTimeout(this.autoResolveTimeout);
                console.warn('images failed to preload, auto resolving');
            }

            if (this.state.ready || !this._mounted) {
                return;
            }

            this.setState({
                ready: true
            });

            if (this.props.onSuccess) {
                this.props.onSuccess();
            }
        }
    }, {
        key: '_handleError',
        value: function _handleError(err) {
            if (!this._mounted) {
                return;
            }

            if (this.props.resolveOnError) {
                this._handleSuccess();
            }

            if (this.props.onError) {
                this.props.onError(err);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return this.state.ready && this.props.mountChildren ? this.props.children : this.props.loadingIndicator;
        }
    }]);

    return Preload;
}(_react.Component);

Preload.propTypes = propTypes;
Preload.defaultProps = defaultProps;

exports.default = Preload;