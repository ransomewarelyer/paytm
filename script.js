document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const dateElement = document.getElementById('date');
    const monthElement = document.getElementById('month');
    const yearElement = document.getElementById('year');
    const bookedTimeElement = document.getElementById('booked-time');

    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // 1. Logic to Retrieve or Set Valid Ticket Session
    let purchaseTime = localStorage.getItem('purchaseTime');
    let now = new Date();

    // If no purchase time exists, or if the user wants to simulate a fresh purchase on this page load (logic gap in prompt),
    // we normally rely on the 'PIN' screen to set this. 
    // However, the prompt says: "implement a logic when user purcahsed the ticket... stores the session... only purchase once... when i refresh... same time"
    // implies we strictly read from storage. if null, we might default to NOW for testing or wait for PIN.
    // Given the flow: PIN -> Receipt -> View Pass.

    // If we land here without a purchase time (e.g. direct file open), let's set it to NOW for demonstration purposes 
    // BUT only if not present, to respect "same session" rule.
    if (!purchaseTime) {
        // Option A: Redirect to PIN? 
        // Option B: create a new session (Developer convenience).
        // Let's assume the user just went through PIN flow or we start a session now.
        // purchaseTime = now.toISOString();
        // localStorage.setItem('purchaseTime', purchaseTime);

        // Actually, if I strictly follow "PIN sets it", I should handle the case where it's missing gracefully or show current time.
        // Current script behavior fallback was "Show Current Date". 
        // Let's stick to reading. If missing, we treat "NOW" as the hypothetical purchase time for visual check, but don't save it unless we are in the purchase flow.
        // Wait, simpler: If missing, treat as "Just bought now".
        purchaseTime = now.toISOString();
        // Uncomment to auto-lock session on first visit:
        // localStorage.setItem('purchaseTime', purchaseTime); 
    }

    const purchaseDate = new Date(purchaseTime);

    // 2. Validate 14 Hours Validity
    // If ticket is older than 14 hours, maybe expire it? User didn't ask for expiry handling logic (redirect), just timer.
    const expiryDate = new Date(purchaseDate.getTime() + (14 * 60 * 60 * 1000)); // +14 hours validity

    // 3. Display Static "Booked" Date & Time
    // Format: "18 Nov 2024, 10:45 AM"

    // Date parts
    dateElement.textContent = String(purchaseDate.getDate()).padStart(2, '0');
    monthElement.textContent = months[purchaseDate.getMonth()];
    yearElement.textContent = String(purchaseDate.getFullYear()).slice(-2); // '25

    // Time parts (12h format)
    let hours = purchaseDate.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutes = String(purchaseDate.getMinutes()).padStart(2, '0');

    if (bookedTimeElement) {
        bookedTimeElement.textContent = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    }

    // 4. Timer Logic
    function updateTimer() {
        const currentTime = new Date();
        let diffInSeconds = Math.floor((expiryDate - currentTime) / 1000);

        if (diffInSeconds < 0) {
            diffInSeconds = 0;
            // Optional: Show "Expired" text
        }

        const h = Math.floor(diffInSeconds / 3600);
        const m = Math.floor((diffInSeconds % 3600) / 60);
        const s = diffInSeconds % 60;

        if (hoursElement) hoursElement.textContent = String(h).padStart(2, '0');
        if (minutesElement) minutesElement.textContent = String(m).padStart(2, '0');
        if (secondsElement) secondsElement.textContent = String(s).padStart(2, '0');
    }

    // Initial call & Interval
    updateTimer();
    setInterval(updateTimer, 1000);
});
