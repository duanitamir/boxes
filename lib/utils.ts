import {calculateMinProps} from "./types";

export function getQuotientAndReminder(boxDim: number, cubeDim: number){
    // Return the amount of times a cube can fit in the box in a specific dimension, and the rest, which was now used
    const quotient = Math.floor(boxDim/cubeDim);
    const remainder = boxDim % cubeDim;
    return {quotient, remainder};
}

export function destroyBox(){
    return {h: 0, w: 0, d: 0}
}

export function calculateMinCubes({box, cubes}: calculateMinProps) {
    let counter = 0;
    for (let cube of cubes) {
        // If there are no cube this size, skip iteration
        if (cube.amount <= 0) continue;
        // If the box has dim 0, bottom of rec., skip iteration
        if (box.h <= 0 || box.w <= 0 || box.d <= 0) continue;
        // If the counter is -1, end the rec. with -1, skip iteration
        if ( counter < 0 ) continue;

        // Make sure the cube can fit in the given box
        const {quotient: quotientH, remainder: remainderH} = getQuotientAndReminder(box.h, cube.size);
        const {quotient: quotientW, remainder: remainderW} = getQuotientAndReminder(box.w, cube.size);
        const {quotient: quotientD, remainder: remainderD} = getQuotientAndReminder(box.d, cube.size);

        const numberOfFittingCubes = quotientH * quotientD * quotientW;

        // Start to operate only if there is space for cubes this size in the box, else go to next cube size
        if (numberOfFittingCubes > 0){

            // Check if there are rests
            if (remainderH > 0 && remainderD > 0 && remainderW > 0){
                // Create new boxes (where ever there is a reminder)
                const restBox1 = {h: remainderH, w: box.w, d: box.d };
                const restBox2 = {h: box.h - restBox1.h, w: remainderW, d: box.d};
                const restBox3 = {h: box.h - restBox1.h, w: box.w - restBox2.w, d: remainderD};

                // Curve the box to the size that can contain the cubes
                box.h = box.h - remainderH;
                box.w = box.w - remainderW;
                box.d = box.d - remainderD;


                // Run the process with the new boxes (Rests)
                counter += calculateMinCubes({box: restBox1, cubes});
                counter += calculateMinCubes({box: restBox2, cubes});
                counter += calculateMinCubes({box: restBox3, cubes});
            }

            for (let height = 1; height <= quotientH; height++){
                for (let width = 1; width <= quotientW; width++) {
                    for (let depth = 1; depth <= quotientD; depth++) {
                        if (cube.amount > 0){
                            counter += 1;
                            cube.amount -= 1;
                            if(height===quotientH &&  width==quotientW && depth === quotientD){
                                // If we reach the end of the box, calculate the rest or destroy the box if there's no rest
                                if (box.h - height*cube.size>0 ||  box.w - width*cube.size > 0 || box.d - depth*cube.size > 0){
                                    box = {
                                        h: Math.max(box.h - height*cube.size, box.h),
                                        w: Math.max(box.w - width*cube.size, box.w),
                                        d: Math.max(box.d - depth*cube.size, box.d)
                                    }
                                }else{
                                    box = destroyBox()
                                }
                            }
                        }
                        else{
                            // If the box is still not full and there are no boxes of 1x1x1, we can not fill, return -1
                            if (cube.size === 1){
                                counter = -1;
                                continue;
                            }

                            // Calculate the leftovers in each dimension
                            // Vertical leftovers
                            const restBox1 = { h: (quotientH-height) * cube.size, w: quotientW * cube.size ,d: quotientD * cube.size};

                            //  Can be maximum one cube's height, because the rest will be in box1 => h is always cube.size (l.76)
                            // Horizontal leftovers
                            const restBox2 = {h: cube.size, w: (quotientW-width) * cube.size ,d: cube.size};
                            // Depth leftovers
                            const restBox3 = {h: cube.size, w: quotientW * cube.size, d: Math.max((quotientD - depth), 1) * cube.size };

                            // Destroy the old box
                            box = destroyBox()

                            // Calculate for each of the new boxes
                            counter += calculateMinCubes({box: restBox1, cubes});
                            counter += calculateMinCubes({box: restBox2, cubes});
                            counter += calculateMinCubes({box: restBox3, cubes});
                        }
                    }
                }
            }
        }
        // If the box still have space to fill, and we don't have any 1x1x1 cubes left, set counter to -1 end rec. (l. 19)
        if (cube.size === 1 && cube.amount === 0 && box.h > 0 && box.w > 0 && box.d > 0) counter = -1;
    }
    return counter;
}

export function validateInput(input: string) {
    const reg = /^\d+ \d+ \d+( \d+)+( )*?$/
    return reg.test(input)
}


export function parseTask(task: string): calculateMinProps{
    const parse = task.split(' ')

    const box = {
        h: parseInt(parse.shift(),10),
        w: parseInt(parse.shift(),10),
        d: parseInt(parse.shift(),10)
    }
    const cubes = (parse.map((value, index) =>
        ({size: 2**index,
            amount: parseInt(value,10)}))).reverse()

    return {box, cubes}
}
