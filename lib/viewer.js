"use strict";

var _share = require("./share.js");

var _react = require("react");

var React = _interopRequireWildcard(_react);

var _d = require("d3");

var d3 = _interopRequireWildcard(_d);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

window.gcexports.viewer = function () {
  var Viewer = React.createClass({
    displayName: "Viewer",

    componentDidMount: function componentDidMount() {
      d3.select("#graff-view").append("div").classed("done-rendering", true);
    },
    render: function render() {
      // If you have nested components, make sure you send the props down to the
      // owned components.
      var props = this.props;
      var obj = props.obj ? [].concat(props.obj) : [];
      var elts = [];
      obj.forEach(function (d, i) {
        var style = {};
        if (d.style) {
          Object.keys(d.style).forEach(function (k) {
            style[k] = d.style[k];
          });
        }
        var val = d.value ? d.value : d;
        if (val instanceof Array) {
          val = val.join(" ");
        } else if (typeof val !== "string" && typeof val !== "number" && typeof val !== "boolean") {
          val = JSON.stringify(val);
        }
        elts.push(React.createElement(
          "span",
          { key: i, style: style },
          val
        ));
      });
      return elts.length > 0 ? React.createElement(
        "div",
        null,
        React.createElement("link", { rel: "stylesheet", href: "/L0/style.css" }),
        React.createElement(
          "div",
          { className: "L0" },
          elts
        )
      ) : React.createElement("div", null);
    }
  });
  return {
    Viewer: Viewer
  };
}(); /* Copyright (c) 2017, Art Compiler LLC */