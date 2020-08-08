export default function converterHourToMinute(time: string) {
    
    const [hour, minutes] = time.split(':').map(Number);

    // transforma hora em minutos
    const timeInMinutes = (hour * 60) + minutes; 

    return timeInMinutes;
}