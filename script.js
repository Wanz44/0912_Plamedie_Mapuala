(function () {
    // ---- Génération des pétales romantiques ----
    const petalContainer = document.getElementById('petal-container');
    for (let i = 0; i < 40; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 7 + 5) + 's';
        petal.style.animationDelay = (Math.random() * -10) + 's';
        petal.style.opacity = 0.4 + Math.random() * 0.5;
        petal.style.transform = `rotate(${Math.random() * 90}deg) scale(${0.7 + Math.random() * 0.8})`;
        petalContainer.appendChild(petal);
    }

    // ---- Éléments principaux ----
    const yesBtn = document.getElementById('yesBtn');
    const buttonArea = document.getElementById('buttonArea');
    const loveMsg = document.getElementById('loveMessage');
    const nameGlow = document.querySelector('.name-glow');
    const heartBig = document.querySelector('.heart-big');

    // Création du bouton NON (initialement placé au centre)
    const noBtn = document.createElement('button');
    noBtn.id = 'noBtn';
    noBtn.className = 'btn btn-no';
    noBtn.textContent = 'Non 🥺'; // Note : il y a un espace insécable ici pour éviter la cassure
    buttonArea.appendChild(noBtn);

    // Variables de fuite agressive
    let mouseX = -800000, mouseY = -30000; // coordonnées souris
    let runAwayActive = true; // vrai tant que Oui pas cliqué
    let noBtnVisible = true;   // le bouton non est visible (pas disparu)
    let areaRect, noRect;
    let currentLeft = 0, currentTop = 0;

    // Initialisation : placer le bouton Non dans un endroit "aléatoire" mais pas trop loin
    function randomPosInitial() {
        if (!runAwayActive) return;
        areaRect = buttonArea.getBoundingClientRect();
        noRect = noBtn.getBoundingClientRect();
        const maxLeft = areaRect.width - noRect.width;
        const maxTop = areaRect.height - noRect.height;
        // On le met dans un coin au début pour qu'il bouge dès le départ
        const corner = Math.floor(Math.random() * 4); // 0: top-left, 1: top-right, 2: bottom-left, 3: bottom-right
        let left, top;
        if (corner === 0) { left = 0; top = 0; }
        else if (corner === 1) { left = maxLeft; top = 0; }
        else if (corner === 2) { left = 0; top = maxTop; }
        else { left = maxLeft; top = maxTop; }

        noBtn.style.left = left + 'px';
        noBtn.style.top = top + 'px';
        currentLeft = left;
        currentTop = top;
        noBtnVisible = true;
    }

    // Mettre à jour les dimensions
    function updateRects() {
        areaRect = buttonArea.getBoundingClientRect();
        noRect = noBtn.getBoundingClientRect();
    }

    // Fonction pour faire fuir le bouton NON loin de la souris (et même avant)
    function fleeFromMouse() {
        if (!runAwayActive || !noBtnVisible) return;

        updateRects();

        // Centre du bouton Non
        const noCenterX = areaRect.left + currentLeft + noRect.width / 2;
        const noCenterY = areaRect.top + currentTop + noRect.height / 2;

        // Distance entre souris et centre du bouton
        const dist = Math.hypot(mouseX - noCenterX, mouseY - noCenterY);

        // Seuil de fuite : on fuit même si la souris est assez loin, mais pour un effet plus dynamique,
        // on va le faire bouger en permanence (sauter) dès que la souris bouge, mais pour éviter qu'il reste trop près,
        // on le déplace violemment si distance < 300px. S'il est loin, on le fait aussi bouger légèrement (style esquive préventive)
        if (dist < 350) {  // zone de danger
            // Vecteur de fuite : du centre vers la souris (on veut s'éloigner)
            let dx = noCenterX - mouseX;
            let dy = noCenterY - mouseY;
            const length = Math.hypot(dx, dy);
            if (length < 0.1) {
                dx = Math.random() - 0.5;
                dy = Math.random() - 0.5;
            } else {
                dx /= length;
                dy /= length;
            }

            // Distance de fuite : un bond assez grand
            const moveDistance = 280 + Math.random() * 150; // bond aléatoire fort

            // Nouvelle position (centre visé)
            let newCenterX = noCenterX + dx * moveDistance;
            let newCenterY = noCenterY + dy * moveDistance;

            // Conversion en left/top
            let newLeft = newCenterX - areaRect.left - noRect.width / 2;
            let newTop = newCenterY - areaRect.top - noRect.height / 2;

            // Clamping dans les limites
            const maxLeft = areaRect.width - noRect.width;
            const maxTop = areaRect.height - noRect.height;
            newLeft = Math.min(maxLeft, Math.max(0, newLeft));
            newTop = Math.min(maxTop, Math.max(0, newTop));

            noBtn.style.left = newLeft + 'px';
            noBtn.style.top = newTop + 'px';
            currentLeft = newLeft;
            currentTop = newTop;
        } else {
            // Même si la souris est loin, on a une petite chance de bouger pour plus d'imprévisibilité (effet "frémissement")
            if (Math.random() < 0.03) { // 3% de chance à chaque mouvement
                const maxLeft = areaRect.width - noRect.width;
                const maxTop = areaRect.height - noRect.height;
                const jumpLeft = Math.random() * maxLeft;
                const jumpTop = Math.random() * maxTop;
                noBtn.style.left = jumpLeft + 'px';
                noBtn.style.top = jumpTop + 'px';
                currentLeft = jumpLeft;
                currentTop = jumpTop;
            }
        }
        // Mise à jour du rect après mouvement
        noRect = noBtn.getBoundingClientRect();
    }

    // --- Écouteurs de souris ---
    document.addEventListener('mousemove', (e) => {
        if (!runAwayActive) return;
        mouseX = e.clientX;
        mouseY = e.clientY;
        fleeFromMouse();
    });

    // Pour mobile, on utilise touchmove
    document.addEventListener('touchmove', (e) => {
        if (!runAwayActive) return;
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
            fleeFromMouse();
        }
    }, { passive: true });

    document.addEventListener('touchstart', (e) => {
        if (!runAwayActive) return;
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
            fleeFromMouse();
        }
    });

    // --- Gestion du clic sur Non : il disparaît puis réapparaît dans un coin ---
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!runAwayActive) return;

        // Disparaît
        noBtn.style.opacity = '0';
        noBtnVisible = false;

        // Après un petit délai, réapparaît dans un coin aléatoire
        setTimeout(() => {
            if (!runAwayActive) {
                // Si Oui a été cliqué entre-temps, on ne fait pas réapparaître
                return;
            }
            updateRects();
            const maxLeft = areaRect.width - noRect.width;
            const maxTop = areaRect.height - noRect.height;
            // Choisir un coin : 0 = top-left, 1 = top-right, 2 = bottom-left, 3 = bottom-right
            const corner = Math.floor(Math.random() * 4);
            let newLeft, newTop;
            switch (corner) {
                case 0: newLeft = 0; newTop = 0; break;
                case 1: newLeft = maxLeft; newTop = 0; break;
                case 2: newLeft = 0; newTop = maxTop; break;
                default: newLeft = maxLeft; newTop = maxTop; break;
            }
            noBtn.style.left = newLeft + 'px';
            noBtn.style.top = newTop + 'px';
            currentLeft = newLeft;
            currentTop = newTop;
            noBtn.style.opacity = '1';
            noBtnVisible = true;
            updateRects();
        }, 200); // 200ms de disparition
    });

    // --- Clic sur Oui : victoire, plus de fuite, message et explosion de bonheur
    yesBtn.addEventListener('click', () => {
        runAwayActive = false;
        // Cacher le bouton Non
        noBtn.style.display = 'none';
        noBtnVisible = false;

        // Afficher le message
        loveMsg.classList.remove('hidden');

        // Modifier quelques éléments pour le fun
        heartBig.innerHTML = '💞💖';
        nameGlow.style.background = 'linear-gradient(45deg, gold, #ffc0cb, #fff)';
        nameGlow.style.webkitBackgroundClip = 'text';
        nameGlow.style.color = 'transparent';

        // Petit bonus : faire apparaître plein de cœurs (via pétales déjà présents)
        for (let i = 0; i < 10; i++) {
            const p = document.createElement('div');
            p.className = 'petal';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDuration = '2s';
            p.style.background = 'gold';
            p.style.boxShadow = '0 0 40px #ff69b4';
            p.style.opacity = '1';
            petalContainer.appendChild(p);
        }
    });

    // Au redimensionnement, on ajuste pour éviter que le bouton ne sorte
    window.addEventListener('resize', () => {
        if (!runAwayActive) return;
        setTimeout(() => {
            updateRects();
            // Vérifier que le bouton est toujours dans les limites
            const maxLeft = areaRect.width - noRect.width;
            const maxTop = areaRect.height - noRect.height;
            let newLeft = Math.min(maxLeft, Math.max(0, currentLeft));
            let newTop = Math.min(maxTop, Math.max(0, currentTop));
            if (newLeft !== currentLeft || newTop !== currentTop) {
                noBtn.style.left = newLeft + 'px';
                noBtn.style.top = newTop + 'px';
                currentLeft = newLeft;
                currentTop = newTop;
            }
        }, 30);
    });

    // Initialisation position
    setTimeout(() => {
        if (runAwayActive) {
            randomPosInitial();
            updateRects();
        }
    }, 50);

    // Force la mise à jour des rects après chargement des polices
    window.addEventListener('load', () => {
        setTimeout(() => {
            updateRects();
        }, 100);
    });

    // Pour que le bouton fuie de manière encore plus imprévisible, on ajoute un "trembleur"
    setInterval(() => {
        if (!runAwayActive || !noBtnVisible) return;
        // 20% de chance de faire un petit saut même sans souris (pour esquive préventive)
        if (Math.random() < 0.2) {
            updateRects();
            const maxLeft = areaRect.width - noRect.width;
            const maxTop = areaRect.height - noRect.height;
            const jumpX = Math.random() * maxLeft;
            const jumpY = Math.random() * maxTop;
            noBtn.style.left = jumpX + 'px';
            noBtn.style.top = jumpY + 'px';
            currentLeft = jumpX;
            currentTop = jumpY;
        }
    }, 400); // toutes les 400ms, possibilité de bouger
})();