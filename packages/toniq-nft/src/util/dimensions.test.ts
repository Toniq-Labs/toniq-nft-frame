import {itCases} from '@augment-vir/browser-testing';
import {calculateRatio, determineConstraintDimension} from './dimensions';

describe(determineConstraintDimension.name, () => {
    itCases(determineConstraintDimension, [
        {
            it: 'should return whatever in square case',
            input: {
                constraint: {
                    width: 1,
                    height: 1,
                },
                box: {
                    width: 1,
                    height: 1,
                },
                constraintType: 'max',
            },
            // currently defaults to height in this case
            expect: 'height',
        },
        {
            it: 'should return width in max landscape case',
            input: {
                constraint: {
                    width: 3,
                    height: 3,
                },
                box: {
                    width: 5,
                    height: 2,
                },
                constraintType: 'max',
            },
            expect: 'width',
        },
        {
            it: 'should return height in min landscape case',
            input: {
                constraint: {
                    width: 3,
                    height: 3,
                },
                box: {
                    width: 5,
                    height: 2,
                },
                constraintType: 'min',
            },
            expect: 'height',
        },
        {
            it: 'should return height in max portrait case',
            input: {
                constraint: {
                    width: 8,
                    height: 4,
                },
                box: {
                    width: 5,
                    height: 6,
                },
                constraintType: 'max',
            },
            expect: 'height',
        },
    ]);
});

describe(calculateRatio.name, () => {
    itCases(calculateRatio, [
        {
            it: 'should return 1 if no min or max are given',
            input: {
                box: {
                    height: Math.random() * 100,
                    width: Math.random() * 100,
                },
            },
            expect: 1,
        },
        {
            it: 'should return 1 if box fits min',
            input: {
                min: {
                    height: 3,
                    width: 3,
                },
                box: {
                    height: 4,
                    width: 6,
                },
            },
            expect: 1,
        },
        {
            it: 'should return 1 if box fits max',
            input: {
                max: {
                    height: 12,
                    width: 10,
                },
                box: {
                    height: 4,
                    width: 6,
                },
            },
            expect: 1,
        },
        {
            it: 'should fit to min if smaller in one dimension',
            input: {
                min: {
                    height: 3,
                    width: 3,
                },
                box: {
                    height: 1,
                    width: 6,
                },
            },
            expect: 3,
        },
        {
            it: 'should fit to min if smaller in both dimensions',
            input: {
                min: {
                    height: 3,
                    width: 3,
                },
                box: {
                    height: 1,
                    width: 2.5,
                },
            },
            expect: 3,
        },
        {
            it: 'should fit to max if bigger in one dimension',
            input: {
                max: {
                    height: 3,
                    width: 3,
                },
                box: {
                    height: 1,
                    width: 6,
                },
            },
            expect: 0.5,
        },
        {
            it: 'should fit to max if bigger in both dimension',
            input: {
                max: {
                    height: 3,
                    width: 3,
                },
                box: {
                    height: 4,
                    width: 6,
                },
            },
            expect: 0.5,
        },
        {
            it: 'should fit to min and max if smaller than min',
            input: {
                min: {
                    height: 4,
                    width: 4,
                },
                max: {
                    height: 12,
                    width: 12,
                },
                box: {
                    height: 2,
                    width: 10,
                },
            },
            expect: 2,
        },
        {
            it: 'should fit to min and max if bigger than max',
            input: {
                min: {
                    height: 4,
                    width: 4,
                },
                max: {
                    height: 12,
                    width: 12,
                },
                box: {
                    height: 24,
                    width: 10,
                },
            },
            expect: 0.5,
        },
        {
            it: 'should return 1 if the nft fits within min and max',
            input: {
                min: {
                    height: 4,
                    width: 4,
                },
                max: {
                    height: 12,
                    width: 12,
                },
                box: {
                    height: 6,
                    width: 8,
                },
            },
            expect: 1,
        },
    ]);
});
