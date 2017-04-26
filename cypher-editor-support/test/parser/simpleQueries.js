/*
 * Copyright (c) 2002-2017 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import assert from 'assert';
import { CypherEditorSupport } from '../../src/CypherEditorSupport';
import { reduceTree } from '../util';

describe('Parser - Simple queries', () => {
  it('should return correct ast for simple query', () => {
    const backend = new CypherEditorSupport('RETURN 42;');

    assert.deepEqual(backend.parseErrors, []);
    // todo: ast checks
    // assert.deepEqual(reduceTree(backend.parseTree), simpleAst);
  });

  it('should return errors for incorrect query', () => {
    const b = new CypherEditorSupport('POTATO');

    assert.deepEqual(b.parseErrors, [{
      line: 1,
      col: 0,
      msg: "extraneous input 'POTATO' expecting {<EOF>, ':', CYPHER, EXPLAIN, PROFILE, USING, CREATE, DROP, LOAD, WITH, OPTIONAL, MATCH, UNWIND, MERGE, SET, DETACH, DELETE, REMOVE, FOREACH, RETURN, START, CALL, SP}",
    }]);
    assert.deepEqual(reduceTree(b.parseTree), {
      rule: 'CypherContext',
      start: { line: 1, column: 0 },
      stop: { line: 1, column: 5 },
      children: [{ rule: 'ErrorNodeImpl', start: {}, stop: {}, children: [] }],
    });
  });

  it('should return errors if error in lexer', () => {
    const b = new CypherEditorSupport('WITH a` WITH 1;');

    assert.deepEqual(b.parseErrors, [
      {
        col: 6,
        line: 1,
        msg: "token recognition error at: '` WITH 1;'",
      },
    ]);
  });
});