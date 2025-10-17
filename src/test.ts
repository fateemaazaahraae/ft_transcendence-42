interface Car {
  make: string;
  model: string;
  mileage?: number;
}

let myCar: Car = {
  make: 'Ford',
  model: 'Focus',
};

console.log(myCar.mileage)