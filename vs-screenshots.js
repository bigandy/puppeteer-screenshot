const puppeteer = require("puppeteer");

let pages = require("./config/vs-pages");

if (process.argv[2] !== "undefined" && process.argv[2] !== "--prod") {
  pages = [pages[0]];
  // } else {
  // pages = pages.slice(0, 50);
}

console.log(pages);

const base = "https://brokernotes.co";

const width = 480;
const height = 270;

const work = async site => {
  try {
    const browser = await puppeteer.launch({ dumpio: true });
    const page = await browser.newPage();
    await page.setViewport({
      width,
      height,
      isMobile: true
    });
    await page.goto(`${base}/${site}/`, { waitUntil: "networkidle2" });

    await page.addScriptTag({
      content: `
			const images = document.querySelectorAll('th img');
			images.forEach(image => image.src = image.src.replace('q_auto:best,f_auto,w_38/', ''));
		`
    });

    await page.addStyleTag({
      content: `th {
			border: 0;
		}

		header,
		.main-menu-navbar-wrapper,
		th a.bname span,
		tbody,
		.sticky-warning,
		.cookie-notice,
		.cta-button,
		.connectivity  {
			display: none;
		}

		th {
			height: ${height}px;
			background-color: transparent;
		}

		th a {
			background-color: white;
			border: 0;
			margin-top: 65px;
			margin-left: 28px;
			width: 138px;
			line-height: 110px;
		}

		th.b-1 {
			position: relative;
		}

		th.b-1 a {
			margin-left: 52px;
		}

		th.b-1::after {
			display: block;
			position: absolute;
			content: 'VS';
			background: #90D6B9;
			border-radius: 50%;
			top: 105px;
			color: white;
			left: -2em;
			padding: 1.35em;
			font-size: 16px;
			font-weight: bold;
		}

		table {
			border: 0;
		}

		thead tr {
			background-image: url(https://www.ventureharbour.com/wp-content/uploads/bg.png);
			// background-position: 50% 50%;
		}
		`
    });

    const table = await page.$("table");
    await table.screenshot({
      path: `images/vs-screenshots/${site}.png`,
      clip: {
        x: 0,
        y: 28,
        height: 260,
        width
      },
      omitBackground: true
    });
    browser.close();
  } catch (err) {
    console.log(err.message);
  } finally {
    if (pages.length) {
      work(pages.pop());
    } else {
      process.exit();
    }
  }
};

work(pages.pop());
