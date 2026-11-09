const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// "11/11/2026" -> "11 November 2026"
export function formatDate(dateString) {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("/").map(Number);
    return `${day} ${MONTHS[month - 1]} ${year}`;
}

// "11/11/2026" + "10:00 PM" -> a real Date we can compare with
export function toDateTime(dateString, timeString = "") {
    const [day, month, year] = dateString.split("/").map(Number);
    const [clock = "0:00", period] = timeString.split(" ");
    let [hours, minutes] = clock.split(":").map(Number);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return new Date(year, month - 1, day, hours || 0, minutes || 0);
}

// True once the event's date and time have gone by
export const isPastEvent = (event) => toDateTime(event.date, event.time) < new Date();
