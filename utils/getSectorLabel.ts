export const getSectorLabel = (sector: string) => {
  return {
    Accommodation: 'Konaklama',
    Rental: 'Kiralama',
    Grooming: 'Bakım',
    Food: 'Yemek',
  }[sector];
};
