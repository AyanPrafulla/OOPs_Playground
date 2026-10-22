/**
 * OOPs Playground - Learning Data & Quiz Repository
 * Contains comprehensive lesson content, code snippets, analogies, common pitfalls,
 * and 15 multiple-choice quiz questions covering Java OOP concepts.
 */

const LESSONS_DATA = {
  'classes-objects': {
    id: 'classes-objects',
    title: 'Classes & Objects',
    subtitle: 'The Foundation: Blueprints vs. Memory Instances',
    difficulty: 'Beginner',
    tag: 'Foundation',
    badgeClass: 'badge-emerald',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
    analogy: 'Think of an architectural blueprint for a house. The blueprint itself is not a house—you cannot live inside it. It defines dimensions, rooms, and structural layout. When builders construct houses from that blueprint, each house is an independent object residing at a specific physical address, possessing its own unique paint color and occupants.',
    javaCode: `// 1. Defining the Blueprint (Class)
class Car {
    // Fields (State / Attributes)
    String color;
    int speed;

    // Method (Behavior)
    void drive() {
        System.out.println("Car is moving at " + speed + " km/h with color " + color);
    }
}

// 2. Instantiating & Using Objects in main
public class Main {
    public static void main(String[] args) {
        // 'new' allocates memory in the Heap; 'myCar' holds its reference
        Car myCar = new Car();
        myCar.color = "Red";
        myCar.speed = 60;
        myCar.drive();

        // Second independent object instance
        Car sportsCar = new Car();
        sportsCar.color = "Blue";
        sportsCar.speed = 120;
        sportsCar.drive();
    }
}`,
    codeExplanation: [
      { line: 'class Car { ... }', desc: 'Declares a custom user-defined type (class) that acts as a blueprint for car objects.' },
      { line: 'String color; int speed;', desc: 'Instance variables that store the unique state of each Car object created in Heap memory.' },
      { line: 'void drive() { ... }', desc: 'An instance method defining actions that any Car object can perform using its own fields.' },
      { line: 'Car myCar = new Car();', desc: '\'Car myCar\' creates a reference variable on the Call Stack. \'new Car()\' allocates space on the Heap and returns its memory address.' },
      { line: 'myCar.color = "Red";', desc: 'Uses the dot operator (.) to dereference the object in Heap memory and assign value to its fields.' }
    ],
    expectedOutput: `Car is moving at 60 km/h with color Red
Car is moving at 120 km/h with color Blue`,
    commonMistakes: [
      'Confusing the Class with an Object (e.g., trying to access Car.speed directly without creating an instance or declaring it static).',
      'Forgetting to initialize an object with the "new" keyword, leaving reference variables null and triggering NullPointerException.',
      'Assuming modifying the fields of "myCar" will alter "sportsCar". Objects occupy separate memory allocations in the JVM Heap.'
    ],
    knowledgeCheck: {
      question: 'When the line "Car myCar = new Car();" executes in Java, what happens in memory?',
      options: [
        'A copy of the class bytecode is duplicated into the method area',
        'Memory is allocated in the JVM Heap for the new instance, and its reference is stored in the Stack variable "myCar"',
        'The JVM creates a static singleton instance shared across all variables',
        'The Car object is created directly in the CPU register for instantaneous execution'
      ],
      correctIndex: 1,
      explanation: 'The "new" operator dynamically allocates memory on the Heap for the Car instance variables, and the memory address reference is assigned to the Stack variable "myCar".'
    }
  },

  'inheritance': {
    id: 'inheritance',
    title: 'Inheritance',
    subtitle: 'Code Reusability & The "IS-A" Relationship Hierarchy',
    difficulty: 'Beginner - Intermediate',
    tag: 'Hierarchy',
    badgeClass: 'badge-blue',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v6m0 0 3-3m-3 3-3-3"/><rect x="6" y="8" width="12" height="6" rx="1"/><path d="M6 14v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4"/><path d="M12 14v6"/></svg>`,
    analogy: 'Consider genetic traits or vehicle manufacturing. A generalized classification "Vehicle" defines basic mechanical properties like starting an engine. Rather than re-inventing engine ignition from scratch for Cars and Bikes, both classes inherit from Vehicle ("Car IS-A Vehicle"). They immediately acquire Vehicle capabilities while defining their own specific perks, like opening a trunk.',
    javaCode: `// Superclass (Parent Class)
class Vehicle {
    String brand = "Standard Vehicle";

    void start() {
        System.out.println("Vehicle started: Engine ignition active.");
    }
}

// Subclass (Child Class) reusing and extending Vehicle
class Car extends Vehicle {
    int passengerDoors = 4;

    void openTrunk() {
        System.out.println("Trunk opened: Cargo area accessible.");
    }
}

// Another Subclass
class Bike extends Vehicle {
    void kickStand() {
        System.out.println("Kickstand folded: Ready to ride.");
    }
}

public class Main {
    public static void main(String[] args) {
        Car myCar = new Car();
        // Inherited method from Vehicle superclass:
        myCar.start();
        // Child-specific method:
        myCar.openTrunk();
    }
}`,
    codeExplanation: [
      { line: 'class Vehicle { ... }', desc: 'Defines the general base class containing common fields and operations.' },
      { line: 'class Car extends Vehicle', desc: 'The "extends" keyword designates Vehicle as Car\'s superclass, inheriting all non-private members.' },
      { line: 'myCar.start();', desc: 'Car objects can invoke start() even though start() was written in the Vehicle class. Code reuse in action!' },
      { line: 'myCar.openTrunk();', desc: 'Child classes can define unique specialized methods not present in the parent.' }
    ],
    expectedOutput: `Vehicle started: Engine ignition active.
Trunk opened: Cargo area accessible.`,
    commonMistakes: [
      'Attempting multiple class inheritance (e.g., "class Car extends Vehicle, Machine"). Java disallows extending multiple classes directly to eliminate the Diamond Problem.',
      'Assuming child classes can directly access "private" fields of the parent class. Private members are not directly visible; use protected or public getters/setters.',
      'Forgetting that the superclass constructor super() is implicitly or explicitly called before the subclass constructor executes.'
    ],
    knowledgeCheck: {
      question: 'Why does Java disallow multiple class inheritance (a class directly extending two or more classes)?',
      options: [
        'To prevent performance slowdowns during Garbage Collection',
        'To avoid ambiguity known as the "Diamond Problem" where two parent classes define colliding methods with the same signature',
        'Because child classes are not permitted to have more methods than their superclasses',
        'Because memory can only store one class header at a time in the Java Virtual Machine'
      ],
      correctIndex: 1,
      explanation: 'The Diamond Problem arises when two parents define the same method and a child inherits both, leaving the compiler unsure which parent implementation to execute. Java solves this by permitting single class inheritance.'
    }
  },

  'encapsulation': {
    id: 'encapsulation',
    title: 'Encapsulation',
    subtitle: 'Data Hiding & Defensive State Protection via Controlled Access',
    difficulty: 'Intermediate',
    tag: 'Security & State',
    badgeClass: 'badge-violet',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
    analogy: 'Consider a bank ATM. You cannot reach inside the machine to manually grab cash or modify the bank database ledger. The money is securely shielded (private). The ATM provides a keypad, screen, and card reader (public methods) that enforce validation—checking your PIN and funds—before modifying the balance.',
    javaCode: `public class BankAccount {
    // 1. Private field: Internal state is hidden from external tampering
    private double balance;

    // 2. Controlled Public Setter / Mutator with business validation
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println("Successfully deposited: $" + amount);
        } else {
            System.out.println("Error: Deposit amount must be positive.");
        }
    }

    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            System.out.println("Successfully withdrew: $" + amount);
            return true;
        } else {
            System.out.println("Error: Insufficient funds or invalid amount.");
            return false;
        }
    }

    // 3. Controlled Public Getter: Read-only access
    public double getBalance() {
        return balance;
    }
}

public class Main {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount();
        acc.deposit(100.0);
        acc.withdraw(40.0);
        System.out.println("Current Verified Balance: $" + acc.getBalance());

        // ILLEGAL: Compiler error! Cannot access private field:
        // acc.balance = -999999;
    }
}`,
    codeExplanation: [
      { line: 'private double balance;', desc: 'The "private" access modifier restricts access exclusively to code inside the BankAccount class.' },
      { line: 'if (amount > 0) { balance += amount; }', desc: 'Validates business invariants before altering state, rejecting negative or zero deposits.' },
      { line: 'public double getBalance()', desc: 'Provides safe, read-only inspection of internal state without exposing the variable for direct reassignment.' },
      { line: '// acc.balance = -999999;', desc: 'Direct mutation is blocked at compile time, eliminating corrupted states.' }
    ],
    expectedOutput: `Successfully deposited: $100.0
Successfully withdrew: $40.0
Current Verified Balance: $60.0`,
    commonMistakes: [
      'Declaring fields public for quick convenience, leaving system state vulnerable to corrupt or negative values from external callers.',
      'Generating boilerplate getters and setters without validation logic, which effectively reduces protection back to public access.',
      'Returning direct references to mutable internal reference types (like Date or ArrayList) instead of defensive copies.'
    ],
    knowledgeCheck: {
      question: 'What is the primary design purpose of declaring class variables "private" in Java?',
      options: [
        'To speed up CPU register allocation during bytecode execution',
        'To protect internal state from accidental corruption and enforce strict validation rules via controlled public methods',
        'To allow the class to be serialized automatically across network sockets',
        'To force the JVM garbage collector to reclaim the object faster'
      ],
      correctIndex: 1,
      explanation: 'Encapsulation shields the internal representation of an object. Making fields private ensures outside classes cannot corrupt the object\'s state and must adhere to validation rules in getter/setter methods.'
    }
  },

  'polymorphism': {
    id: 'polymorphism',
    title: 'Polymorphism',
    subtitle: 'Many Forms: Dynamic Method Dispatch & Runtime Overriding',
    difficulty: 'Intermediate',
    tag: 'Flexibility',
    badgeClass: 'badge-amber',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
    analogy: 'Consider a universal remote control with a "Power" button. When you point the remote at a Television, pressing Power turns on the screen. When pointed at an Air Conditioner, pressing the exact same Power button starts the compressor. The command is identical ("press power"), but the resulting behavior is determined by the target device.',
    javaCode: `// Superclass
class Animal {
    void makeSound() {
        System.out.println("Animal sound: Generic acoustic signal");
    }
}

// Child class with specialized implementation
class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("Woof! Dog barks enthusiastically.");
    }
}

// Another child class with specialized implementation
class Cat extends Animal {
    @Override
    void makeSound() {
        System.out.println("Meow! Cat purrs and vocalizes.");
    }
}

public class Main {
    public static void main(String[] args) {
        // Polymorphic reference: Parent type variable holding child instance
        Animal myPet;

        myPet = new Dog();
        myPet.makeSound(); // Dispatches dynamically to Dog's makeSound()!

        myPet = new Cat();
        myPet.makeSound(); // Dispatches dynamically to Cat's makeSound()!
    }
}`,
    codeExplanation: [
      { line: 'class Animal { void makeSound() { ... } }', desc: 'Defines the base method that subclasses will override.' },
      { line: '@Override void makeSound() { ... }', desc: 'The @Override annotation informs the compiler that the subclass is replacing the superclass behavior with its own.' },
      { line: 'Animal myPet = new Dog();', desc: 'Polymorphic assignment: The reference variable is of parent type Animal, but points to a Dog in Heap memory.' },
      { line: 'myPet.makeSound();', desc: 'Dynamic Method Dispatch: Java looks up the actual object in Heap memory at runtime (vtable) and executes Dog\'s implementation.' }
    ],
    expectedOutput: `Woof! Dog barks enthusiastically.
Meow! Cat purrs and vocalizes.`,
    commonMistakes: [
      'Confusing Method Overriding (runtime polymorphism: same name and parameter signature in subclass) with Method Overloading (compile-time: same name, different parameters in same class).',
      'Forgetting the @Override annotation, which catches typo errors where you accidentally create a new overloaded method instead of overriding.',
      'Attempting to override private, static, or final methods. In Java, private methods are hidden, static methods are bonded at compile time, and final methods are immutable.'
    ],
    knowledgeCheck: {
      question: 'In Java, when executing "Animal a = new Dog(); a.makeSound();", which version of makeSound() runs and why?',
      options: [
        'Animal\'s version because variable "a" was declared with static type Animal',
        'Dog\'s version because Dynamic Method Dispatch resolves the call at runtime based on the actual object on the Heap',
        'A compile-time type-mismatch error occurs because Animal cannot store a Dog reference',
        'Both methods run sequentially in parent-to-child order'
      ],
      correctIndex: 1,
      explanation: 'This is Dynamic Method Dispatch (Runtime Polymorphism). The declared reference type (Animal) determines what method names are valid at compile-time, while the runtime object on the Heap (Dog) determines which overridden implementation executes.'
    }
  },

  'abstraction': {
    id: 'abstraction',
    title: 'Abstraction',
    subtitle: 'Hiding Complexity: Abstract Contracts & Essential Details',
    difficulty: 'Intermediate - Advanced',
    tag: 'Architecture',
    badgeClass: 'badge-rose',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m4.93 4.93 4.24 4.24"></path><path d="m14.83 9.17 4.24-4.24"></path><path d="m14.83 14.83 4.24 4.24"></path><path d="m9.17 14.83-4.24 4.24"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    analogy: 'Consider the steering wheel and brake pedal of a car. When you press the brake pedal, you do not need to know the hydraulic fluid pressure, brake caliper friction coefficients, or anti-lock braking microcontroller code. The pedal gives you a clean abstract interface: "slow down". The complex engineering is abstracted away from the driver.',
    javaCode: `// 1. Abstract Class: Defines contract and cannot be instantiated directly
abstract class Shape {
    // Abstract method: Has no body; subclasses MUST implement it
    abstract void area();

    // Regular concrete method: Abstract classes can have standard methods too
    void displayInfo() {
        System.out.println("Geometric Shape Calculation:");
    }
}

// 2. Concrete Subclass providing concrete mathematical implementation
class Circle extends Shape {
    private double radius = 5.0;

    // Implementing the required abstract method
    @Override
    void area() {
        double result = Math.PI * radius * radius;
        System.out.println("Area of circle: " + result);
    }
}

// 3. Execution demonstration
public class AbstractionDemo {
    public static void main(String[] args) {
        // Shape s = new Shape(); // ILLEGAL: Cannot instantiate abstract class!

        Shape s = new Circle(); // Legal: Using abstract reference for concrete instance
        s.displayInfo();
        s.area();
    }
}`,
    codeExplanation: [
      { line: 'abstract class Shape { ... }', desc: 'Declares an incomplete class template. Cannot be instantiated directly with \'new Shape()\'.' },
      { line: 'abstract void area();', desc: 'An abstract method signature with no body. It mandates that any concrete subclass must write its own area calculation.' },
      { line: 'class Circle extends Shape { ... }', desc: 'Circle satisfies the abstract contract by implementing the exact signature of void area().' },
      { line: 'Shape s = new Circle(); s.area();', desc: 'The client interacts through the high-level Shape contract without needing to know the internal geometric formulas of Circle.' }
    ],
    expectedOutput: `Geometric Shape Calculation:
Area of circle: 78.53981633974483`,
    commonMistakes: [
      'Trying to instantiate an abstract class directly ("new Shape()"), which triggers a compile-time error.',
      'Forgetting to implement all abstract methods in a concrete child class, leaving the child class uncompilable unless it is also declared abstract.',
      'Confusing an abstract class with an interface. An abstract class can hold instance variables, constructors, and method implementations, whereas interfaces focus strictly on contracts.'
    ],
    knowledgeCheck: {
      question: 'Which of the following statements about Java abstract classes is TRUE?',
      options: [
        'An abstract class can be directly instantiated using the "new" keyword if it contains no abstract methods',
        'An abstract class cannot be instantiated directly; it serves as a conceptual superclass for subclasses to implement',
        'Abstract classes cannot have regular constructors or concrete methods with code bodies',
        'All methods in an abstract class must automatically be declared abstract'
      ],
      correctIndex: 1,
      explanation: 'Abstract classes are intentionally incomplete specifications that cannot be instantiated directly with "new". They can contain both abstract methods and concrete methods with bodies, and subclasses extend them to implement required behavior.'
    }
  }
};

/**
 * 15 Curated Multiple Choice Quiz Questions
 * 3 questions per module, covering Classes & Objects, Inheritance, Encapsulation, Polymorphism, Abstraction.
 */
const QUIZ_QUESTIONS = [
  // --- Classes & Objects ---
  {
    id: 'co-1',
    category: 'Classes & Objects',
    categoryKey: 'classes-objects',
    question: 'What is the relationship between a class and an object in Java?',
    options: [
      'A class is an instantiated entity in memory, while an object is the source code file',
      'A class is a blueprint or template defining fields and methods, while an object is a concrete instance allocated in memory',
      'They are completely synonymous and can be used interchangeably in all Java statements',
      'An object is compiled into bytecode to create a class at runtime'
    ],
    correctIndex: 1,
    explanation: 'A class is a static blueprint or design specification written in code. An object is a concrete runtime instance created from that blueprint using the "new" keyword, occupying space in the JVM Heap.'
  },
  {
    id: 'co-2',
    category: 'Classes & Objects',
    categoryKey: 'classes-objects',
    question: 'Where are Java object instances stored at runtime, and where are local reference variables stored?',
    options: [
      'Objects are in the Call Stack; reference variables are in the Heap',
      'Objects are in the JVM Heap; reference variables are on the Call Stack',
      'Both objects and local reference variables are stored in the CPU cache registers',
      'Objects are stored permanently in the file system until manually deleted'
    ],
    correctIndex: 1,
    explanation: 'In the Java Virtual Machine memory model, object instances and their instance variables reside in the Heap memory, while method call frames and local reference variables reside on the Call Stack.'
  },
  {
    id: 'co-3',
    category: 'Classes & Objects',
    categoryKey: 'classes-objects',
    question: 'What is the default value of an uninitialized instance variable of type String and type int in a Java class?',
    options: [
      '"" (empty string) and 0',
      'null and 0',
      'undefined and NaN',
      'null and -1'
    ],
    correctIndex: 1,
    explanation: 'In Java, instance variables automatically receive default values when an object is instantiated: object references (such as String) default to null, numeric primitives (int, double) default to 0, and booleans default to false.'
  },

  // --- Inheritance ---
  {
    id: 'inh-1',
    category: 'Inheritance',
    categoryKey: 'inheritance',
    question: 'Which Java keyword is used by a class to inherit properties and methods from another class?',
    options: [
      'implements',
      'extends',
      'inherits',
      'super'
    ],
    correctIndex: 1,
    explanation: 'The "extends" keyword is used in Java class declarations to establish an inheritance relationship with a superclass (e.g., "class Car extends Vehicle"). The "implements" keyword is reserved for interfaces.'
  },
  {
    id: 'inh-2',
    category: 'Inheritance',
    categoryKey: 'inheritance',
    question: 'If a parent class Vehicle has a method "start()", can a child class Car access "start()" without re-writing it?',
    options: [
      'No, the child class must always redeclare the method or the compiler fails',
      'Yes, as long as "start()" is not declared private in Vehicle, Car automatically inherits it',
      'Yes, but only if Car explicitly declares an interface named VehicleInterface',
      'No, because Java requires all methods to be declared static for inheritance'
    ],
    correctIndex: 1,
    explanation: 'Public, protected, and package-private methods of a superclass are inherited by subclasses automatically. Subclasses can invoke them directly without rewriting any code.'
  },
  {
    id: 'inh-3',
    category: 'Inheritance',
    categoryKey: 'inheritance',
    question: 'Which of the following describes the root class from which all Java classes inherit, directly or indirectly?',
    options: [
      'java.lang.System',
      'java.lang.Object',
      'java.lang.Class',
      'java.util.Base'
    ],
    correctIndex: 1,
    explanation: 'java.lang.Object is the ultimate ancestor and root superclass in Java\'s class hierarchy. Every class in Java automatically extends Object either directly or indirectly, providing default methods like toString(), equals(), and hashCode().'
  },

  // --- Encapsulation ---
  {
    id: 'enc-1',
    category: 'Encapsulation',
    categoryKey: 'encapsulation',
    question: 'Which combination of design practices best exemplifies good encapsulation in Java?',
    options: [
      'Declaring all variables public so all classes in the project can access them with zero performance overhead',
      'Declaring instance variables private and providing public getter and setter methods with validation logic',
      'Making all methods private and all variables public',
      'Declaring every class and method as static final'
    ],
    correctIndex: 1,
    explanation: 'Encapsulation bundles data and methods together while hiding internal details. Declaring fields private prevents uncontrolled external manipulation, and public accessor/mutator methods enforce validation invariants.'
  },
  {
    id: 'enc-2',
    category: 'Encapsulation',
    categoryKey: 'encapsulation',
    question: 'In a BankAccount class with "private double balance;", why is the following code rejected by the compiler: "account.balance = -1000;"?',
    options: [
      'Because negative numbers are not supported by the double data type',
      'Because the private modifier restricts direct field access strictly to code inside the BankAccount class itself',
      'Because balance is an immutable keyword in Java',
      'Because the JVM forbids modifying balances outside of synchronized threads'
    ],
    correctIndex: 1,
    explanation: 'The "private" access modifier restricts access exclusively to members of the containing class. External code attempting direct access triggers a compile-time "balance has private access in BankAccount" error.'
  },
  {
    id: 'enc-3',
    category: 'Encapsulation',
    categoryKey: 'encapsulation',
    question: 'What is a significant advantage of using setter methods over direct field access?',
    options: [
      'Setters run faster because they bypass JVM bytecode verification',
      'Setters allow defensive validation checks, logging, and state integrity guarantees before values are saved',
      'Setters automatically write the variable to disk storage',
      'Setters eliminate the need for constructors in Java'
    ],
    correctIndex: 1,
    explanation: 'Setter methods allow you to inspect and validate data (e.g. checking if deposit amount > 0) before modifying internal state, preventing corrupted or illegal states.'
  },

  // --- Polymorphism ---
  {
    id: 'poly-1',
    category: 'Polymorphism',
    categoryKey: 'polymorphism',
    question: 'What is Method Overriding in Java?',
    options: [
      'Defining multiple methods in the same class with the same name but different parameter lists',
      'Providing a specific implementation in a subclass for a method that is already defined in its superclass, with identical signature',
      'Renaming a superclass method at runtime using reflection',
      'Deleting an unused superclass method from memory'
    ],
    correctIndex: 1,
    explanation: 'Method Overriding occurs when a subclass provides its own specific implementation of a method already declared in its superclass, having the exact same name, return type, and parameters.'
  },
  {
    id: 'poly-2',
    category: 'Polymorphism',
    categoryKey: 'polymorphism',
    question: 'What does the term "Dynamic Method Dispatch" refer to in Java?',
    options: [
      'Resolving overloaded methods at compile time based on argument types',
      'The mechanism by which a call to an overridden method is resolved at runtime based on the actual object instance on the Heap rather than the reference type',
      'Spawning a new CPU thread dynamically for every method execution',
      'Compiling Java bytecode to native machine code during execution'
    ],
    correctIndex: 1,
    explanation: 'Dynamic Method Dispatch is the foundation of runtime polymorphism in Java. When an overridden method is invoked on a superclass reference, the JVM checks the actual object instance on the Heap at runtime to decide which subclass version to execute.'
  },
  {
    id: 'poly-3',
    category: 'Polymorphism',
    categoryKey: 'polymorphism',
    question: 'Which of the following cannot be overridden in a Java subclass?',
    options: [
      'A method with public access modifier',
      'A method declared with the "final" or "static" modifier',
      'A method that returns a custom object type',
      'A method that has no parameters'
    ],
    correctIndex: 1,
    explanation: 'Methods declared "final" cannot be overridden by definition. "static" methods cannot be overridden because they are bound at compile time to the class rather than dynamically dispatched on instances.'
  },

  // --- Abstraction ---
  {
    id: 'abs-1',
    category: 'Abstraction',
    categoryKey: 'abstraction',
    question: 'What happens if you attempt to compile: "Shape s = new Shape();" where Shape is declared as an abstract class?',
    options: [
      'The code compiles and runs, creating a generic Shape object',
      'A compilation error occurs because abstract classes cannot be directly instantiated',
      'A runtime NullPointerException is thrown when s is first referenced',
      'The JVM creates a temporary anonymous subclass automatically'
    ],
    correctIndex: 1,
    explanation: 'Abstract classes are intentionally incomplete templates that can contain abstract methods without bodies. The Java compiler strictly forbids instantiating an abstract class directly using the "new" operator.'
  },
  {
    id: 'abs-2',
    category: 'Abstraction',
    categoryKey: 'abstraction',
    question: 'If a class Circle extends an abstract class Shape that contains "abstract void area();", what MUST Circle do to be a valid concrete class?',
    options: [
      'Declare radius as a public static variable',
      'Provide a concrete implementation for the "void area()" method',
      'Rename its class to AbstractCircle',
      'Declare its own constructor private'
    ],
    correctIndex: 1,
    explanation: 'A concrete subclass extending an abstract class must provide implementations for all inherited abstract methods; otherwise, the subclass itself remains incomplete and must also be declared abstract.'
  },
  {
    id: 'abs-3',
    category: 'Abstraction',
    categoryKey: 'abstraction',
    question: 'What is the primary architectural purpose of Abstraction in software design?',
    options: [
      'To make source code files larger so they are easier to split across teams',
      'To hide complex implementation details and expose only the essential clean interface necessary for clients to interact with',
      'To completely eliminate the need for classes and objects in programming',
      'To guarantee that all variables are automatically saved to a database'
    ],
    correctIndex: 1,
    explanation: 'Abstraction manages complexity by presenting a high-level contract or interface to the outside world, hiding internal mechanical or mathematical details so clients do not depend on volatile implementation specifics.'
  }
];
