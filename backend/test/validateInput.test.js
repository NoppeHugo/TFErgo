const { validatePatientData } = require('../src/utils/validateInput');

describe('validatePatientData', () => {
  it('devrait retourner true pour un patient valide', () => {
    const patient = {
      firstName: 'Jean',
      lastName: 'Dupont',
      sex: 'M',
      birthdate: '1990-01-01',
      niss: '12345678901',
    };
    const result = validatePatientData(patient);
    expect(result).toBe(true);
  });

  it('devrait retourner false si le prénom est manquant', () => {
    const patient = {
      lastName: 'Dupont',
      sex: 'M',
      birthdate: '1990-01-01',
      niss: '12345678901',
    };
    const result = validatePatientData(patient);
    expect(result).toBe(false);
  });

  // Ajoute d'autres cas limites ici
});
