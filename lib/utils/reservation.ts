import { toDateId } from '@marceloterreiro/flash-calendar';

export const generateTimeList = (prop: any, period: number) => {
  let timeList = [];
  if (prop) {
    let startTime = prop?.opening;
    let endTime = prop?.closing;

    // Saatleri dakika cinsine çevir
    let startMinutes = toMinutes(startTime);
    let endMinutes = toMinutes(endTime);

    // 30 dakika aralıklarla liste oluştur
    for (let minutes = startMinutes; minutes <= endMinutes; minutes += period) {
      timeList.push(toTimeFormat(minutes));
    }
  }

  return timeList;
};

export const getOffDayDatesOfCurrentYear = (daysOfWeekInput: string[]) => {
  let allSpecificDays = [];
  let year = new Date().getFullYear();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Her ay için döngü
  for (let month = 0; month < 12; month++) {
    for (let dayOfWeek of daysOfWeekInput) {
      let targetDay = daysOfWeek.indexOf(dayOfWeek);

      let date = new Date(year, month, 1);

      // İlk hedef günü bul
      while (date.getDay() !== targetDay) {
        date.setDate(date.getDate() + 1);
      }

      // Ayın sonuna kadar hedef günleri ekle
      while (date.getMonth() === month) {
        allSpecificDays.push(toDateId(date)); // Tarihleri diziye ekle
        date.setDate(date.getDate() + 7); // Bir sonraki aynı gün
      }
    }
  }

  return allSpecificDays;
};

// Zamanı dakikaya çevir
function toMinutes(time: any) {
  let [hours, minutes] = time?.split(':').map(Number);
  return hours * 60 + minutes;
}

// Dakikayı "HH:MM" formatına çevir
function toTimeFormat(minutes: any) {
  let hours = Math.floor(minutes / 60);
  let mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export const getDatesInRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateArray = [];
  let currentDate = start;

  while (currentDate <= end) {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Aylar 0-indexlidir, bu yüzden +1 yapıyoruz
    const day = String(currentDate.getDate()).padStart(2, '0');

    dateArray.push(`${year}-${month}-${day}`);

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
};
