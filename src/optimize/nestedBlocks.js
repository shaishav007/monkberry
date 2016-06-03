import {visit} from '../visitor';
import {getStringLiteralValue} from '../utils';

export function nestedBlocks(ast) {
  visit(ast, {
    IfStatement: (node) => {
      doNested(node, 'then');
      doNested(node, 'otherwise');
    },
    ForStatement: (node) => {
      doNested(node, 'body');
    }
  });
}


function doNested(node, key) {
  if (node[key]) {
    if (node[key].length == 1 && node[key][0].type == 'BlockStatement') {
      let name = node[key][0].name;
      if (node[key][0].name.type != 'Literal') {
        throw new SyntaxError(`Name of block can be only StringLiteral. Error in file "${name.loc.source}" on line #${name.loc.start.line}.`);
      }

      node.templateNames = node.templateNames || {};
      node.templateNames[key] = getStringLiteralValue(name);
      node[key] = node[key][0].body;
    }
  }
}