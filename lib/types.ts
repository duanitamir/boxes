import readline from "readline";

export type CubesType = {
        size: number,
        amount: number
    }[]

export type BoxType = {
    h: number,
    w: number,
    d: number
}


export const readLineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

export interface calculateMinProps {
    box: BoxType,
    cubes: CubesType
}
