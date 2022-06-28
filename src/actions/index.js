export const numPress = (num) => {
  return {
    type: 'NUMPRESS',
    payload: num
  }
}

export const opPress = (op) => {
  return {
    type: 'OPPRESS',
    payload: op
  }
}