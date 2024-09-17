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
    Accommodation: { title: 'Dairelerim', singular: 'daire', placeholder: 'Kat: 6, D.No: 3' },
    Rental: { title: 'Araçlarım', singular: 'araç', placeholder: 'Peugeot 408 - 2024 (34 UA 34)' },
    Grooming: { title: 'Personellerim', singular: 'personel', placeholder: 'Ayşe Yılmaz' },
    Food: { title: 'Masalarım', singular: 'masa', placeholder: 'Bahçe - Masa No: 2' },
  }[sector];
};
