const puppeteer = require('puppeteer');

const sites = require('./sites');

(async () => {
	try {
		const base = 'https://brokernotes.co';

		const width = 400;

		sites.map(async site => {
			const browser = await puppeteer.launch();
			const page = await browser.newPage();
			await page.setViewport({
				width,
				height: 290,
				isMobile: true,
			});
			await page.goto(`${base}/${site}/`, { waitUntil: 'networkidle2' });

			await page.addStyleTag({
				content: `th {
					border: 0;
				}

				th a.bname span,
				tbody,
				.sticky-warning,
				.cookie-notice,
				.cta-button  {
					display: none;
				}

				th.b-1 {
					position: relative;
				}

				th.b-1::after {
					display: block;
					position: absolute;
					content: 'VS';
					background: lightgrey;
					border-radius: 50%;
					top: 50%;
					color: black;
					left: -2em;
					padding: 1em;
					z-index: 10000;
				}
				`
			});


			const table = await page.$('table');
			await table.screenshot({
				path: `images/${site}.png`,
				clip: {
					x: 0,
					y: 420,
					height: 180,
					width,
				},
				omitBackground: true,
			});

			await browser.close();
		});

	} catch(e) {
		console.error(e);
	}

})();
