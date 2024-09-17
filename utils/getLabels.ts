export const getSectorLabel = (sector: string) => {
  return {
    Accommodation: 'Konaklama',
    Rental: 'Kiralama',
    Grooming: 'Bakım',
    Food: 'Yemek',
  }[sector];
};

export const getDayLabel = (day: string) => {
  return {
    Monday: 'Pazartesi',
    Tuesday: 'Salı',
    Wednesday: 'Çarsamba',
    Thursday: 'Perşembe',
    Friday: 'Cuma',
    Saturday: 'Cumartesi',
    Sunday: 'Pazar',
  }[day];
};

export const getAssetLabel = (sector: string) => {
  return {
    Accommodation: 'Dairelerim',
    Rental: 'Araçlarım',
    Grooming: 'Personellerim',
    Food: 'Masalarım',
  }[sector];
};
