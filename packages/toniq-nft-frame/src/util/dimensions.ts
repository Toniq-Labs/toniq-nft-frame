import {clamp, mapObjectValues, PartialAndNullable} from '@augment-vir/common';
import {ReadonlyDeep} from 'type-fest';
import {greaterThan, lessThan} from './number';

export type Dimensions = {
    width: number;
    height: number;
};

const defaultBox: Dimensions = {
    width: 250, // 250 = idk we have to pick SOMETHING
    height: 250,
} as const;

/**
 * Min = trying to grow the box to be at least the constraint
 *
 * Max = trying to shrink the box to fit within the constraint
 */
type MinOrMax = 'min' | 'max';

export function determineConstraintDimension({
    constraint,
    box,
    constraintType = 'max',
}: ReadonlyDeep<{
    constraint: Dimensions;
    box: Dimensions;
    constraintType: MinOrMax;
}>): keyof Dimensions {
    const comparison = constraintType === 'max' ? greaterThan : lessThan;

    if (comparison(box.width / box.height, constraint.width / constraint.height)) {
        return 'width';
    } else {
        return 'height';
    }
}

function calculateConstraintRatio({
    box,
    constraint,
    constraintType,
}: ReadonlyDeep<{
    box: Dimensions;
    constraint: Dimensions;
    constraintType: MinOrMax;
}>): number {
    const constraintDimension = determineConstraintDimension({
        box,
        constraint,
        constraintType: constraintType,
    });

    const ratio = constraint[constraintDimension] / box[constraintDimension];

    return ratio;
}

export function factorDimensions({
    box,
    ratio,
}: ReadonlyDeep<{box: Dimensions; ratio: number}>): Dimensions {
    return mapObjectValues(box, (key, value) => value * ratio);
}

export type DimensionConstraints = {
    min: Dimensions;
    max: Dimensions;
};

export type OptionalConstraintsWithBox = {
    box: Dimensions;
} & PartialAndNullable<DimensionConstraints>;

export function clampDimensions({
    box,
    min,
    max,
}: ReadonlyDeep<OptionalConstraintsWithBox>): Dimensions {
    return mapObjectValues(box, (axis, originalValue) => {
        return clamp({
            value: originalValue,
            min: min?.[axis] ?? 0,
            max: max?.[axis] ?? Infinity,
        });
    });
}

export function scaleToConstraints({
    min,
    max,
    box,
}: ReadonlyDeep<OptionalConstraintsWithBox>): Dimensions {
    const ratio = calculateRatio({
        min,
        max,
        box,
    });

    const resizedBox = factorDimensions({box, ratio});
    return {
        height: Math.floor(resizedBox.height || min?.height || defaultBox.height),
        width: Math.floor(resizedBox.width || min?.width || defaultBox.width),
    };
}

export function calculateRatio({min, max, box}: ReadonlyDeep<OptionalConstraintsWithBox>): number {
    if (!min && !max) {
        return 1;
    }

    const minRatio = min
        ? calculateConstraintRatio({
              box,
              constraint: min,
              constraintType: 'min',
          })
        : 1;
    const maxRatio = max
        ? calculateConstraintRatio({
              box,
              constraint: max,
              constraintType: 'max',
          })
        : 1;

    const initialRatio = minRatio > 1 ? minRatio : maxRatio < 1 ? maxRatio : 1;

    const factoredBox = factorDimensions({ratio: initialRatio, box});

    const doubleMinRatio = min
        ? calculateConstraintRatio({
              box: factoredBox,
              constraint: min,
              constraintType: 'min',
          })
        : 1;

    if (doubleMinRatio > 1) {
        return minRatio;
    } else {
        return initialRatio;
    }
}
