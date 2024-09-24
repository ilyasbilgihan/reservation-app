import { useEffect } from 'react';
import { Iconify } from '~/lib/icons/Iconify';

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

export const getSectorItem = (sector: string) => {
  return {
    Accommodation: {
      icon: (color: any) => (
        <Iconify icon="solar:buildings-3-bold-duotone" size={22} color={color} />
      ),
      value: 'Konaklama',
      title: 'Dairelerim',
      singular: 'daire / oda',
      placeholder: 'Kat: 6, D.No: 3',
      service: 'Oda Temizliği',
    },
    Rental: {
      icon: (color: any) => <Iconify icon="gis:car" size={22} color={color} />,
      value: 'Kiralama',
      title: 'Araçlarım',
      singular: 'araç',
      placeholder: 'Peugeot 408 - 2024 (34 UA 34)',
      service: 'Sigorta',
    },
    Grooming: {
      icon: (color: any) => <Iconify icon="solar:chair-2-bold-duotone" size={22} color={color} />,
      value: 'Bakım',
      title: 'Personellerim',
      singular: 'personel',
      placeholder: 'Ayşe Yılmaz',
      service: 'Saç Boyama, Saç Kesim vs.',
    },
    Food: {
      icon: (color: any) => (
        <Iconify icon="fluent:service-bell-24-filled" size={24} color={color} />
      ),
      value: 'Yemek',
      title: 'Masalarım',
      singular: 'masa',
      placeholder: 'Bahçe - Masa No: 2',
      service: 'Doğum Günü, Kahvaltı vs.',
    },
  }[sector];
};
