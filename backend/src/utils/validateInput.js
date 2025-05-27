function validatePatientData(data) {
  if (!data.firstName) return false;
  if (!data.lastName) return false;
  if (!data.sex) return false;
  if (!data.birthdate) return false;
  if (data.niss && !/^\d{11}$/.test(data.niss)) return false;
  return true;
}

module.exports = { validatePatientData };
