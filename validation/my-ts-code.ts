import { readFileSync } from "node:fs";
// eslint-disable-next-line no-duplicate-imports
import { type PathLike, type PathOrFileDescriptor } from "node:fs";
// eslint-disable-next-line import/consistent-type-specifier-style, no-duplicate-imports
import type { TimeLike } from "node:fs";

import sum from "./module.js";
// eslint-disable-next-line import/extensions
import otherSumAgain from "./my-module";
import { type MyType, b as otherB } from "./other-module.js";

require("./typescript-node-support/my-other-code.ts");
require("./typescript-node-support/my-other-code.js");

sum(a, b);
otherSum(a, b);
otherSumAgain(a, b);

function getSomething<T>(value: T): T {
	return value;
}

const isFunction = typeof readFileSync === "function";

getSomething(isFunction);

const myPath: PathLike = new URL("./file.txt", import.meta.url);
const myPath2: PathOrFileDescriptor = new URL("./file.text", import.meta.url);
const myTime: TimeLike = new Date();

getSomething(myPath);
getSomething(myPath2);
getSomething(myTime);

getSomething(otherB);

const myValue: MyType = 5;

getSomething(myValue);

// Declaring variables with types
// eslint-disable-next-line prefer-const
let message = "Hello, TypeScript!";
const count = 10;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isDone = false;

type myStringType = string;

// Function with type annotations
function add(a: number, b: number): number {
	return a + b;
}

getSomething(message);
getSomething(add(count, 5));

// Defining an interface
interface Person {
	name: myStringType;
	age: number;
	occupation?: string; // Optional property
}

// Using the interface
const user: Person = {
	name: "John Doe",
	age: 30,
	occupation: "Software Engineer",
};

function greet(person: Person): string {
	return `Hello, ${person.name}!`;
}

getSomething(greet(user));

// Defining a class
class Animal {
	name: string;

	constructor(name: string) {
		this.name = name;
	}

	makeSound(): void {
		getSomething("Generic animal sound");
	}
}

// Subclassing
class Dog extends Animal {
	breed: string;

	constructor(name: string, breed: string) {
		super(name);
		this.breed = breed;
	}

	override makeSound(): void {
		getSomething("Woof!");
	}
}

const animal = new Animal("Animal");
const dog = new Dog("Buddy", "Golden Retriever");

animal.makeSound();
dog.makeSound();

function getString(myVar) {
	return myVar;
}

getString("test");

// Generic function
function identity<T>(arg: T): T {
	return arg;
}

const myString: string = identity<string>("hello");
const myNumber: number = identity<number>(123);

getSomething(myString);
getSomething(myNumber);

const myArray = [1, 2, 3] as const;

myArray.map((value) => sum(value, 1));

function myFuncBar<T extends string[]>(myArray: T): T {
	return myArray;
}

myFuncBar(["foo", "bar"]);

type T = string;

const myConst: T = "string";

interface MyT {
	x: number;
}

const myX: MyT = { x: 100 };

identity(myConst);
identity(myX);

interface ButtonProps {
	onClick: () => void;
}

class Button implements ButtonProps {
	onClick = () => getSomething("button!");
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function test() {}

const arrowFn = () => "test";

class Test {
	// Should indicate that no value is returned (void)
	method() {
		// Method
	}
}

function myTest(): void {
	// Function
}

class MyAnimal {
	constructor(
		public breed,
		name,
	) {
		// Parameter property and constructor
		this.animalName = name;
	}

	private animalName: string; // Property

	get name(): string {
		// get accessor
		return this.animalName;
	}

	set name(value: string) {
		// set accessor
		this.animalName = value;
	}

	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	public walk() {
		// method
	}

	otherWalk() {
		// Public method too
	}
}

// eslint-disable-next-line prefer-exponentiation-operator
const foo = Math.pow(2, 8);

sum(1, foo);

export { Button, MyAnimal, Test, arrowFn, myTest, test };
export type { ButtonProps };
