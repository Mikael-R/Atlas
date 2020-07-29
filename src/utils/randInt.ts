type RandInt = (mix: number, max: number) => number

const randInt: RandInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min)) + min
}

export default randInt
