"use strict";const _jsxFileName = "";Object.defineProperty(exports, "__esModule", {value: true});var _react = require('react');

 function App() {
  const [list, setList] = _react.useState.call(void 0, [])

  _react.useEffect.call(void 0, () => {
    // 获取文章下所有的 h1,h2,h3 标签
    const nodes = document.querySelectorAll('.md > h1,h2,h3')
    setList(
      Array.from(nodes).map((node) => ({
        title: node.textContent,
        id: node.id,
        depth: +node.tagName[1],
      })),
    )
  }, [])
  return (
    React.createElement('ul', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 18}}      , list.map(({ title, id, depth }) => (
        React.createElement('li', { key: id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 20}}          , React.createElement('a', { href: `#${id}`, style: { paddingLeft: depth * 16 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 21}}            , title          )        )
      ))    )
  )
} exports.default = App;