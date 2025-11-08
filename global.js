// 1. Инициализация Firebase
const firebaseConfig = {
            apiKey: "AIzaSyCAOfxPW5m2UqtulWzuh3egOjJ-ti-rDf8",
            authDomain: "register-221e5.firebaseapp.com",
            projectId: "register-221e5",
            storageBucket: "register-221e5.appspot.com",
            messagingSenderId: "588640206529",
            appId: "1:588640206529:web:b2abf5413387e251935e40",
            measurementId: "G-XN40PT5PV2"
        };
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();

// 2. Управление присутствием пользователя (Online/Offline)
function setupPresence(user) {
    const userStatusDatabaseRef = database.ref('/users/' + user.uid);
    const isOfflineForDatabase = {
        lastOnline: firebase.database.ServerValue.TIMESTAMP,
        isOnline: false
    };
    const isOnlineForDatabase = {
        lastOnline: firebase.database.ServerValue.TIMESTAMP,
        isOnline: true
    };

    database.ref('.info/connected').on('value', function(snapshot) {
        if (snapshot.val() === false) {
            return;
        };
        userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
            userStatusDatabaseRef.set(isOnlineForDatabase);
        });
    });

    // Увеличиваем счетчик визитов при входе
    userStatusDatabaseRef.child('totalVisits').transaction(currentValue => {
        return (currentValue || 0) + 1;
    });
}

// 3. НОВАЯ ГЛОБАЛЬНАЯ ФУНКЦИЯ (перенесена из home.html)
function getTimeAgo(timestamp) {
    if (!timestamp) return 'Офлайн';
    const now = new Date().getTime();
    const seconds = Math.floor((now - timestamp) / 1000);

    if (seconds < 5) return 'В сети';
    if (seconds < 60) return `в сети ${seconds} сек. назад`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `в сети ${minutes} мин. назад`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `в сети ${hours} ч. назад`;
    
    const days = Math.floor(hours / 24);
    return `в сети ${days} д. назад`;
}
