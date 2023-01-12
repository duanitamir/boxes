import {calculateMinCubes, destroyBox, getQuotientAndReminder, parseTask, validateInput} from "../lib/utils";
import {calculateMinProps} from "../lib/types";

describe('Utils should work correctly', function() {

    describe('Get Quotient And Reminder', function(){
        it.each([
            [10, 1, 10, 0],
            [10, 4, 2, 2],
            [5, 4, 1, 1],
            [5, 4, 1, 1],
            [2, 4, 0, 2],
        ])('Should return the right values for(%i, %i)', (boxDim, cubeDim, quotient, reminder) => {
            const res = getQuotientAndReminder(boxDim, cubeDim)
            expect(res.quotient).toBe(quotient);
            expect(res.remainder).toBe(reminder);
            expect.assertions(2)

        });
    })

    describe('Destroy Box', function(){
        it('Should destroy a box (create a new 0x0x0 box)', () => {
            const box = destroyBox()

            expect(box).toHaveProperty('h')
            expect(box).toHaveProperty('w')
            expect(box).toHaveProperty('d')
            expect(box.h).toEqual(0)
            expect(box.w).toEqual(0)
            expect(box.d).toEqual(0)

            expect.assertions(6)
        });
    })

    describe('Validate Input', function(){
        it.each([
            ['10 10 10 1 1 1', true],
            ['10 10 10 1 1 1 ', true],
            ['10 10 10 1 1 1    ', true],
            [' 10 10 10 1 1 1    ', false],
            ['text', false],
            ['10 10 10 1 1 1 s', false],
            ['10 10 10 s1 1 1', false],
        ])('Should validate input format for(%i, %i)', (input: string, valid:boolean) => {
            const res = validateInput(input)
            expect(res).toBe(valid)
            expect.assertions(1)

        });
    })

    describe('Parse Task', function (){
        it.each([
            ['10 10 10 2000', {box: {h: 10, w: 10, d: 10}, cubes: [{amount: 2000, size: 1}]}],
            ['10 10 10 900', {box: {h: 10, w: 10, d: 10}, cubes: [{amount: 900, size: 1}]}],
            ['1 1 10 900 0 0 0 1', {box: {h: 1, w: 1, d: 10}, cubes: [{amount: 1, size: 16}, {amount: 0, size: 8},  {amount: 0, size: 4}, {amount: 0, size: 2}, {amount: 900, size: 1}]}],
        ])('Should parse the task correctly for (%i,%i)', (task: string, parsed: calculateMinProps) => {

            const obj = parseTask(task)
            expect(obj).toHaveProperty('box')
            expect(obj).toHaveProperty('cubes')
            expect(obj).toEqual(parsed)

            expect.assertions(3)
        });
    })

    describe('Calculate Min Cubes', function(){
        it.each([
            [1000, '10 10 10 2000'],
            [-1, '10 10 10 900'],
            [9, '4 4 8 10 10 1'],
            [62, '5 5 5 61 7 1'],
            [59, '5 5 6 61 4 1'],
            [50070, '1000 1000 1000 0 0 0 46501 0 2791 631 127 19 1'],
            [9, '1 1 9 9 1'],
        ])('Should return (%i) for (%i)', (result: number, input:string) => {
            const parsed = parseTask(input)
            const res = calculateMinCubes(parsed)
            expect(res).toBe(result)
            expect.assertions(1)
        });
    })
})
