const calculateBMI = (height, weight) => {

  const bmi = weight / ((height / 100) ** 2)

  const roundedBMI = Number(bmi.toFixed(1))

  let category = 'Normal'

  if (roundedBMI < 18.5) {
    category = 'Underweight'
  }

  else if (roundedBMI >= 25 && roundedBMI < 30) {
    category = 'Overweight'
  }

  else if (roundedBMI >= 30) {
    category = 'Obesity'
  }

  return {
    bmi: roundedBMI,
    category,
    healthyRange: '18.5 - 24.9'
  }

}

export default calculateBMI