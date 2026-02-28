const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Capture console messages
    page.on('console', msg => {
        console.log(`[CONSOLE] ${msg.type()}: ${msg.text()}`);
    });

    page.on('pageerror', err => {
        console.log('[PAGE ERROR]', err.toString());
    });

    console.log('Navigating to http://localhost:8001...');

    try {
        // Wait until network is somewhat idle
        await page.goto('http://localhost:8001', { waitUntil: 'networkidle2', timeout: 30000 });
        console.log('Page loaded according to network. Waiting exactly 15 seconds to observe the "blackscreen" gap behavior...');

        // Wait for the full Spline and Preloader sequence to resolve
        await new Promise(r => setTimeout(r, 15000));

        console.log('\n--- Checking DOM State ---');
        const state = await page.evaluate(() => {
            const hero = document.getElementById('hero');
            const preloader = document.querySelector('.preloader');
            const isLoading = getComputedStyle(document.body).display;
            return {
                preloaderExists: !!preloader,
                preloaderDisplay: preloader ? preloader.style.display : null,
                heroExists: !!hero,
                heroHtmlClass: hero ? hero.className : null,
                heroFirstLine: hero ? hero.querySelector('h1')?.outerHTML : null
            };
        });

        console.log(JSON.stringify(state, null, 2));

    } catch (err) {
        console.error('Failed to load or test the page:', err);
    }

    await browser.close();
})();
