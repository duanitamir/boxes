// @ts-ignore
import {calculateMinCubes, parseTask, validateInput} from "./lib/utils.ts";
// @ts-ignore
import {readLineInterface} from "./lib/types.ts";
import * as fs from "fs";
import chalk from "chalk";


function runFunction(tasks: string[]){
    tasks.forEach((task: string) => {

        const res = parseTask(task)

        const result = calculateMinCubes(res)
        console.log(result);
    })
}
function main(line: string, pervTasks: string[]) {
    let tasks = [...pervTasks]

    if (process.argv.length >= 3){
        tasks = fs.readFileSync(process.argv[2], 'utf8')
            .toString()
            .trimEnd()
            .split("\n");

        runFunction(tasks)
        process.exit(0);
    }
    readLineInterface.question(line, (answer: string) => {
        switch (answer){
            case('problems'):
                tasks = fs.readFileSync('tmp/problems.txt', 'utf8')
                    .toString()
                    .trimEnd()
                    .split("\n");
                runFunction(tasks)
                tasks = []
                break;

            case('q'):
                process.exit(0)
                break;

            case('ok'):
                runFunction(tasks)
                tasks = []
                break;

            default:
                if (validateInput(answer)){
                    tasks.push(answer.trimEnd())
                    break
                }
                console.log(chalk.red.bold('\nWrong input format, please follow the correct format'))
                console.log(chalk.blue('h w d ')+chalk.green('n n n ..'))
                console.log('Where: \n'+ '• '+chalk.blue('h w d')+' are the dimension (height, width, depth) \n• '+chalk.green('n')+' represent number of cubes for different sizes\n\nTo quit type '+chalk.yellow('\"q\"\n'))
        }
        main(line, tasks)
    })
}

main("Enter input: ", [])
