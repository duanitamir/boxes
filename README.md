# Boxes challenge

You are given a box with integer dimensions length x width x height. You also have a set of cubes whose sides are powers of 2, e.g. 1x1x1, 2x2x2, 4x4x4 etc.

You need to fill the box with cubes from the set.

Write a program that for a given box and given set of cubes can determine the smallest number of cubes needed to fill the box.

The set of cubes can be represented for instance as a list or array of numbers, where the position in the list designates the dimension of the cube. E.g. 100 10 1 means you have 100 cubes of 1x1x1 and 10 cubes of 2x2x2 and 1 cube of 4x4x4.

A problem specification is a sequence of lines separated by newline. Each line has the box dimensions as the first three elements and the remaining elements enumerate the given cubes. Elements are separated by a single space. Lines are terminated by your platform's newline convention. E.g.

2 3 4 5 6
7 8 9 1 2 3 4

specifies two problems:
a box with dimensions 2 x 3 x 4, 5 cubes of 1x1x1 and 6 cubes of 2x2x2
a box with dimensions 7 x 8 x 9, 1 cube of 1x1x1, 2 of 2x2x2, 3 of 4x4x4, and 4 of 8x8x8.

Your program should read one or more problem specifications from stdin and print the answer to each problem on stdout. Spend as little effort as possible on parsing and validation of the input. An unsolvable problem should yield -1. Please provide instructions on how to run / compile your program.

Examples:
Assume the file 'problems.txt' contains:

10 10 10 2000
10 10 10 900
4 4 8 10 10 1
5 5 5 61 7 1
5 5 6 61 4 1
1000 1000 1000 0 0 0 46501 0 2791 631 127 19 1
1 1 9 9 1

Then executing

./myprogram < problems.txt

should print the following to stdout:
1000
-1
9
62
59
50070
9


# Setup
Install dependencies:

`yarn install`

# Test 
Test the different utility functions with

`yarn test`



-----

# Operate 
The application can be use in an interactive mode, and in a Read Only mode.

---
## Read Only mode 
Read a given `.txt` file and omit the answers.

`yarn start tmp/problems.txt`

Or start the application in interactive mode and type `problems`.

## Interactive Mode
1. Run the application with <br/>`yarn start`
2. Interact with the Terminal to instruct the program `(h w d ...)`.

### Input Format
The input should align with the following format: box dimensions as the first three elements and the remaining elements enumerate the given cubes. Elements are separated by a single space.
E.g.

2 3 4 5 6 - a box with dimensions 2 x 3 x 4, 5 cubes of 1x1x1 and 6 cubes of 2x2x2

7 8 9 1 2 3 4 - a box with dimensions 7 x 8 x 9, 1 cube of 1x1x1, 2 of 2x2x2, 3 of 4x4x4, and 4 of 8x8x8.

### Run
After giving the input, in a new line type `ok` and press enter.

### Quit
In order to quit, type `q` and press enter.

--- 
# Logic 

## The Process
The recursive process work as following:

Given:
* Box, object with dimensions as properties (height, width and depth)
* Cubes, list of cubes inventory (size, amount)
1. Iterate over the different cube sizes, from the larges to the smallest operating over the box, (also main box/`main`).
2. For each cube size `s`, calculate the biggest Sub-Box `sub` of the main box `main`, which can contain cubes in size `s` (in each dimension, check how many boxes will fit).
   * If all dimensions of sub are greater than 0, than `sub` can contain cubes of size `s`, proceed:
      1. `sub` become `main`.
      2. Create a box in each dimension with the leftovers and recursively call the main function.
   * Else, at least one dimension of `sub` is 0, `main` stays the main box, continue to a smaller cube size with `main`.
3. iterate over `main` and count cubes size `s` that can fit, and in the inventory
4. If `main` is filled, we return the counter, else, we calculate the unfilled area in each dimension and recursively call the main function with each of them.

## Main Solving Principles
The approach taken to solve the challenge was to divide it into simpler, easier to solve problems using a divide and conquer approach. The following principles were followed during the solution process:

* Handle only one cube size per iteration, iterating over the different cube sizes.
* Fill the largest cubes first to minimize the number of cubes needed.
* Create an optimal working environment by designing a sub-box that is specifically optimized for the current cube size being used. (See [1])
* If the sub-box is not completely filled with the current cube size, calculate the leftover space in each dimension. This leftover space can be filled with smaller cubes in the next iteration, as the sizes are a series of squared numbers.

[1] An optimal working environment refers to the dimension of the box or sub-box being used in the solution process. 
In this case, given a box with dimensions 20x20x6, and a cube with dimensions 4x4x4, a sub-box of size 20x20x4 is created in order to optimize the space for the current cube size. 
The leftover space in each dimension is then calculated and the process is applied recursively to these leftover spaces.
This allows for an efficient use of the available space and helps to minimize the number of cubes needed to fill the box.
