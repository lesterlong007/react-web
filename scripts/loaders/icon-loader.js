const isSingleColor = (content) => {
  const res = content.match(/#[A-Fa-f0-9]+/g);
  return new Set(res).size <= 1;
};

const replaceColor = (content) => {
  // to avoid react warning about use camelCase instead of - to join
  const camel = content.replace(/(?<=[a-zA-Z0-9])-(\w)/g, (_, letter) => letter.toUpperCase());
  const sizeContent = camel
    .replace(/(?<=\s+width=)"\d+"/, '{size}')
    .replace(/(?<=\s+height=)"\d+"/, '{size}');
  if (isSingleColor(sizeContent)) {
    return sizeContent.replace(/"#[A-Fa-f0-9]+"/g, '{color}');
  }
  return sizeContent;
};

module.exports = function (source) {
  return `import React from 'react';const SGVIcon = ({ color, size }) => { return ${replaceColor(source)};}; export default SGVIcon;`;
};
