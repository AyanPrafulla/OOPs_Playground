/**
 * OOPs Playground - Interactive Simulations Engine
 * Implements high-fidelity Computer Science memory-model visualizers:
 * 1. Classes & Objects: Stack References & Heap Memory Allocation
 * 2. Inheritance: UML Hierarchy & Superclass Method Lookup
 * 3. Encapsulation: Shielded Private State & Validated Access Gates
 * 4. Polymorphism: Dynamic Method Dispatch & Virtual Method Table (vtable)
 * 5. Abstraction: Abstract Contracts vs. Concrete Implementation
 */

const Simulator = (() => {
  // -------------------------------------------------------------
  // 1. CLASSES & OBJECTS SIMULATOR
  // -------------------------------------------------------------
  const classesObjectsState = {
    objects: []
  };

  const CAR_COLORS = [
    { name: 'Crimson Red', hex: '#EF4444' },
    { name: 'Electric Blue', hex: '#3B82F6' },
    { name: 'Emerald Green', hex: '#10B981' },
    { name: 'Sunset Amber', hex: '#F59E0B' },
    { name: 'Cyber Violet', hex: '#8B5CF6' }
  ];

  function getNextMemoryAddress() {
    const addresses = ['0x1A4F', '0x3B8C', '0x7E12', '0x9D44', '0xC2A8'];
    const idx = classesObjectsState.objects.length % addresses.length;
    return addresses[idx];
  }

  function createCarObject(varName, colorName, colorHex, speed) {
    if (classesObjectsState.objects.length >= 4) {
      return {
        success: false,
        message: 'Heap Memory Allocation Limit Reached (Max 4 demo instances). Click Reset to clear Heap memory.'
      };
    }

    const memoryAddress = getNextMemoryAddress();
    const id = 'car_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);

    const car = {
      id,
      varName: varName || `myCar${classesObjectsState.objects.length + 1}`,
      colorName,
      colorHex,
      speed: parseInt(speed, 10) || 60,
      memoryAddress,
      createdAt: new Date().toLocaleTimeString()
    };

    classesObjectsState.objects.push(car);
    ProgressManager.recordSimulationTested('classes-objects');

    return {
      success: true,
      car,
      allCars: [...classesObjectsState.objects],
      log: `[JVM Heap] 'new Car()' allocated memory block at ${car.memoryAddress}.\nReference variable '${car.varName}' stored on Call Stack pointing to ${car.memoryAddress}.`
    };
  }

  function driveCar(carId) {
    const car = classesObjectsState.objects.find(c => c.id === carId);
    if (!car) return null;

    return {
      car,
      output: `Car@${car.memoryAddress} [${car.varName}]: "Car is moving at ${car.speed} km/h with color ${car.colorName}."`
    };
  }

  function resetClassesObjects() {
    classesObjectsState.objects = [];
    return {
      success: true,
      log: '[JVM Garbage Collector] All unreferenced Car objects reclaimed. Heap memory cleared.'
    };
  }

  // -------------------------------------------------------------
  // 2. INHERITANCE SIMULATOR
  // -------------------------------------------------------------
  const inheritanceState = {
    selectedClass: 'Car', // 'Car' | 'Bike' | 'Vehicle'
    lastInvocation: null
  };

  const INHERITANCE_MODEL = {
    Vehicle: {
      name: 'Vehicle',
      isSuper: true,
      fields: [{ name: 'String brand', value: '"Standard Vehicle"' }],
      methods: [
        {
          name: 'start()',
          returnType: 'void',
          code: 'System.out.println("Vehicle started: Engine ignition active.");',
          output: 'Vehicle started: Engine ignition active.',
          definedIn: 'Vehicle'
        }
      ]
    },
    Car: {
      name: 'Car',
      extends: 'Vehicle',
      fields: [{ name: 'int passengerDoors', value: '4' }],
      methods: [
        {
          name: 'openTrunk()',
          returnType: 'void',
          code: 'System.out.println("Trunk opened: Cargo area accessible.");',
          output: 'Trunk opened: Cargo area accessible.',
          definedIn: 'Car'
        }
      ]
    },
    Bike: {
      name: 'Bike',
      extends: 'Vehicle',
      fields: [{ name: 'boolean hasKickstand', value: 'true' }],
      methods: [
        {
          name: 'kickStand()',
          returnType: 'void',
          code: 'System.out.println("Kickstand folded: Ready to ride.");',
          output: 'Kickstand folded: Ready to ride.',
          definedIn: 'Bike'
        }
      ]
    }
  };

  function selectInheritanceClass(className) {
    if (INHERITANCE_MODEL[className]) {
      inheritanceState.selectedClass = className;
      ProgressManager.recordSimulationTested('inheritance');
    }
    return getInheritanceData();
  }

  function callInheritanceMethod(className, methodName) {
    const targetClass = INHERITANCE_MODEL[className];
    if (!targetClass) return null;

    ProgressManager.recordSimulationTested('inheritance');

    // Check if defined in current class
    let method = targetClass.methods.find(m => m.name === methodName);
    let resolvedIn = className;
    let isInherited = false;

    // If not found and inherits from Vehicle, check superclass
    if (!method && targetClass.extends) {
      const superClass = INHERITANCE_MODEL[targetClass.extends];
      method = superClass.methods.find(m => m.name === methodName);
      if (method) {
        resolvedIn = targetClass.extends;
        isInherited = true;
      }
    }

    if (!method) return null;

    const result = {
      className,
      methodName,
      resolvedIn,
      isInherited,
      output: method.output,
      lookupTrace: isInherited
        ? `Method '${methodName}' not declared in subclass '${className}'. JVM traversed superclass pointer to '${resolvedIn}' and executed implementation.`
        : `Method '${methodName}' found directly in class '${className}'. Executed directly.`
    };

    inheritanceState.lastInvocation = result;
    return result;
  }

  function getInheritanceData() {
    return {
      selectedClass: inheritanceState.selectedClass,
      model: INHERITANCE_MODEL,
      lastInvocation: inheritanceState.lastInvocation
    };
  }

  // -------------------------------------------------------------
  // 3. ENCAPSULATION SIMULATOR
  // -------------------------------------------------------------
  const encapsulationState = {
    accountNumber: 'ACC-88392',
    balance: 500.0,
    history: [
      { type: 'INITIAL', amount: 500.0, balanceAfter: 500.0, message: 'Account opened with initial balance $500.00', status: 'SUCCESS' }
    ]
  };

  function depositFunds(rawAmount) {
    const amount = parseFloat(rawAmount);
    ProgressManager.recordSimulationTested('encapsulation');

    // Validation Rules
    if (isNaN(amount)) {
      return {
        success: false,
        error: 'Validation Error: Amount must be a valid numeric value.',
        currentBalance: encapsulationState.balance
      };
    }

    if (amount <= 0) {
      return {
        success: false,
        error: `Validation Error: Deposit amount must be strictly greater than $0.00 (Received: $${amount.toFixed(2)}). State preserved.`,
        currentBalance: encapsulationState.balance
      };
    }

    if (amount > 50000) {
      return {
        success: false,
        error: 'Validation Error: Deposit exceeds single-transaction ceiling ($50,000.00). State preserved.',
        currentBalance: encapsulationState.balance
      };
    }

    encapsulationState.balance += amount;
    const logEntry = {
      type: 'DEPOSIT',
      amount,
      balanceAfter: encapsulationState.balance,
      message: `deposit(${amount.toFixed(2)}) validated & processed. State updated.`,
      status: 'SUCCESS'
    };
    encapsulationState.history.unshift(logEntry);

    return {
      success: true,
      message: `Successfully deposited $${amount.toFixed(2)}.`,
      amount,
      currentBalance: encapsulationState.balance,
      history: [...encapsulationState.history]
    };
  }

  function withdrawFunds(rawAmount) {
    const amount = parseFloat(rawAmount);
    ProgressManager.recordSimulationTested('encapsulation');

    if (isNaN(amount)) {
      return {
        success: false,
        error: 'Validation Error: Amount must be a valid numeric value.',
        currentBalance: encapsulationState.balance
      };
    }

    if (amount <= 0) {
      return {
        success: false,
        error: `Validation Error: Withdrawal amount must be greater than $0.00 (Received: $${amount.toFixed(2)}). State preserved.`,
        currentBalance: encapsulationState.balance
      };
    }

    if (amount > encapsulationState.balance) {
      const logEntry = {
        type: 'WITHDRAW',
        amount,
        balanceAfter: encapsulationState.balance,
        message: `withdraw(${amount.toFixed(2)}) REJECTED: Insufficient funds (Available: $${encapsulationState.balance.toFixed(2)}).`,
        status: 'FAILED'
      };
      encapsulationState.history.unshift(logEntry);

      return {
        success: false,
        error: `Validation Error: Insufficient funds! Requested $${amount.toFixed(2)}, but verified balance is only $${encapsulationState.balance.toFixed(2)}. State unchanged.`,
        currentBalance: encapsulationState.balance,
        history: [...encapsulationState.history]
      };
    }

    encapsulationState.balance -= amount;
    const logEntry = {
      type: 'WITHDRAW',
      amount,
      balanceAfter: encapsulationState.balance,
      message: `withdraw(${amount.toFixed(2)}) validated & completed. Cash dispensed.`,
      status: 'SUCCESS'
    };
    encapsulationState.history.unshift(logEntry);

    return {
      success: true,
      message: `Successfully withdrew $${amount.toFixed(2)}.`,
      amount,
      currentBalance: encapsulationState.balance,
      history: [...encapsulationState.history]
    };
  }

  function attemptDirectVariableAccess(illegalValue) {
    ProgressManager.recordSimulationTested('encapsulation');
    return {
      success: false,
      isCompilerError: true,
      error: `COMPILATION ERROR: balance has private access in BankAccount\n--> Main.java:8: error: cannot assign a value to private field 'balance'\n    account.balance = ${illegalValue};\n           ^\n1 error. Build halted. State remained strictly protected at $${encapsulationState.balance.toFixed(2)}.`,
      currentBalance: encapsulationState.balance
    };
  }

  function resetEncapsulation() {
    encapsulationState.balance = 500.0;
    encapsulationState.history = [
      { type: 'INITIAL', amount: 500.0, balanceAfter: 500.0, message: 'Account reset to initial balance $500.00', status: 'SUCCESS' }
    ];
    return {
      success: true,
      currentBalance: 500.0,
      history: [...encapsulationState.history]
    };
  }

  function getEncapsulationData() {
    return {
      accountNumber: encapsulationState.accountNumber,
      balance: encapsulationState.balance,
      history: [...encapsulationState.history]
    };
  }

  // -------------------------------------------------------------
  // 4. POLYMORPHISM SIMULATOR
  // -------------------------------------------------------------
  const polymorphismState = {
    selectedRuntimeObject: 'Dog', // 'Dog' | 'Cat' | 'Animal'
    lastResult: null
  };

  const POLYMORPHISM_OBJECTS = {
    Dog: {
      type: 'Dog',
      isOverride: true,
      memoryAddress: '0x88A1',
      output: 'Woof! Dog barks enthusiastically.',
      explanation: "Dog overrides makeSound(). The JVM's Virtual Method Table (vtable) redirects the call to Dog's implementation on the Heap."
    },
    Cat: {
      type: 'Cat',
      isOverride: true,
      memoryAddress: '0x99C2',
      output: 'Meow! Cat purrs and vocalizes.',
      explanation: "Cat overrides makeSound(). Dynamic dispatch executes Cat's implementation despite the Animal reference."
    },
    Animal: {
      type: 'Animal',
      isOverride: false,
      memoryAddress: '0x11D0',
      output: 'Animal sound: Generic acoustic signal.',
      explanation: 'Base Animal class implementation executed since the runtime object on the Heap is directly an Animal.'
    }
  };

  function selectPolymorphismObject(type) {
    if (POLYMORPHISM_OBJECTS[type]) {
      polymorphismState.selectedRuntimeObject = type;
      ProgressManager.recordSimulationTested('polymorphism');
    }
    return getPolymorphismData();
  }

  function callMakeSound() {
    const selected = POLYMORPHISM_OBJECTS[polymorphismState.selectedRuntimeObject];
    ProgressManager.recordSimulationTested('polymorphism');

    const result = {
      referenceType: 'Animal',
      actualObjectType: selected.type,
      memoryAddress: selected.memoryAddress,
      isOverride: selected.isOverride,
      output: selected.output,
      explanation: selected.explanation,
      vtableLookup: `invokevirtual Animal.makeSound() -> vtable[${selected.type}] -> resolved to ${selected.type}.makeSound()`
    };

    polymorphismState.lastResult = result;
    return result;
  }

  function getPolymorphismData() {
    return {
      selectedRuntimeObject: polymorphismState.selectedRuntimeObject,
      objects: POLYMORPHISM_OBJECTS,
      lastResult: polymorphismState.lastResult
    };
  }

  // -------------------------------------------------------------
  // 5. ABSTRACTION SIMULATOR
  // -------------------------------------------------------------
  const abstractionState = {
    radius: 5.0,
    lastResult: null
  };

  function calculateCircleArea(radiusValue) {
    const r = parseFloat(radiusValue) || 5.0;
    abstractionState.radius = Math.max(1, Math.min(25, r));
    const area = Math.PI * abstractionState.radius * abstractionState.radius;

    ProgressManager.recordSimulationTested('abstraction');

    const result = {
      radius: abstractionState.radius,
      area: area.toFixed(2),
      fullArea: area,
      output: `Area of circle: ${area.toFixed(14)}`,
      abstractContract: 'abstract class Shape { abstract void area(); }',
      concreteClass: 'class Circle extends Shape',
      clientCall: 'Shape s = new Circle(); s.area();',
      explanation: `The client holds a high-level reference to the abstract 'Shape' contract. The exact formula (π * r²) and internal state (radius = ${abstractionState.radius}) are abstracted inside 'Circle'.`
    };

    abstractionState.lastResult = result;
    return result;
  }

  function attemptInstantiateAbstractClass() {
    ProgressManager.recordSimulationTested('abstraction');
    return {
      success: false,
      isCompilerError: true,
      error: `COMPILATION ERROR: Shape is abstract; cannot be instantiated\n--> AbstractionDemo.java:18: error: Shape is abstract; cannot be instantiated\n    Shape s = new Shape();\n              ^\n1 error. Compilation terminated.\nConcept Rule: Abstract classes are incomplete specifications and cannot be created with 'new'. Subclassing is mandatory.`
    };
  }

  function getAbstractionData() {
    return {
      radius: abstractionState.radius,
      lastResult: abstractionState.lastResult || calculateCircleArea(abstractionState.radius)
    };
  }

  return {
    // Colors helper
    CAR_COLORS,
    // Classes & Objects
    createCarObject,
    driveCar,
    resetClassesObjects,
    getClassesObjectsState: () => ({ ...classesObjectsState }),
    // Inheritance
    selectInheritanceClass,
    callInheritanceMethod,
    getInheritanceData,
    // Encapsulation
    depositFunds,
    withdrawFunds,
    attemptDirectVariableAccess,
    resetEncapsulation,
    getEncapsulationData,
    // Polymorphism
    selectPolymorphismObject,
    callMakeSound,
    getPolymorphismData,
    // Abstraction
    calculateCircleArea,
    attemptInstantiateAbstractClass,
    getAbstractionData
  };
})();
