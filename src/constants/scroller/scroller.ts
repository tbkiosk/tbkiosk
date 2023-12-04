const lowFrom = 5
const lowTo = 10
const medTo = 25
const highTo = 50

export const gasInfoMap = [
  { arg: '', label: 'disabled', price: { from: '', to: '' } },
  { arg: 'LOW', label: 'Low', price: { from: lowFrom, to: lowTo } },
  { arg: 'MED', label: 'Medium', price: { from: lowTo, to: medTo } },
  { arg: 'HIGH', label: 'High', price: { from: medTo, to: highTo } },
]

export const getPriceLevel = (_gasPrice: number) => {
  if (_gasPrice < lowTo) {
    return 'Low'
  } else if (_gasPrice < medTo) {
    return 'Medium'
  } else {
    return 'High'
  }
}
