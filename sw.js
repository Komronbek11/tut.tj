self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'check-exams') {
        event.waitUntil(checkNotifications());
    }
});

async function checkNotifications() {
    const now = Date.now();
    const db = await openIDB();
    const tx = db.transaction('exams', 'readonly');
    const store = tx.objectStore('exams');
    const exams = await store.getAll();

    exams.forEach(exam => {
        const examTime = new Date(`${exam.date}T${exam.start}`).getTime();
        if (examTime - 15*60000 <= now && !exam.notified) {
            showNotification(exam);
            markAsNotified(exam.id);
        }
    });
}

async function openIDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('ExamsDB', 1);
        request.onsuccess = () => resolve(request.result);
        request.onerror = reject;
    });
}

async function markAsNotified(id) {
    const db = await openIDB();
    const tx = db.transaction('exams', 'readwrite');
    const store = tx.objectStore('exams');
    const exam = await store.get(id);
    exam.notified = true;
    await store.put(exam);
}

function showNotification(exam) {
    self.registration.showNotification('Напоминание об экзамене', {
        body: `${exam.subject} через 15 минут (${exam.room})`,
        icon: 'icon.png',
        vibrate: [200, 100, 200]
    });
}

