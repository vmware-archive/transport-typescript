/**
 * Copyright(c) VMware Inc. 2016-2018
 */

import { LogUtil } from './util';

describe('Logger Util [log/util.ts]', () => {

    it('Check pretty() method works correctly',
        () => {

            const str = LogUtil.pretty({ question: 'has anyone seen my phone?'});
            expect(str).toEqual('{\n' +
                '  "question": "has anyone seen my phone?"\n' +
                '}');
        }
    );

    it('Check pretty() method works correctly with html',
        () => {

            const str = LogUtil.pretty({ question: 'has anyone seen my phone?'}, true);
            expect(str).toEqual('{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                '<span style="color:black;font-weight:bold">question</span>:&nbsp;&nbsp;"has&nbsp;&nbsp;&nbsp;&nbsp;' +
                'anyone&nbsp;&nbsp;&nbsp;&nbsp;seen&nbsp;&nbsp;&nbsp;&nbsp;my&nbsp;&nbsp;&nbsp;&nbsp;phone?"<br>}');
        }
    );
});

