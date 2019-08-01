const puppeteer = require("puppeteer");

let affLinks = require("./config/vs-aff-links");

// if (process.argv[2] !== "undefined" && process.argv[2] !== "--prod") {
//   //   affLinks = [affLinks[0]];
// //   affLinks = affLinks.slice(0, 10);
//   // } else {
// }

// console.log(affLinks);

const base = "https://brokernotes.co";

const width = 1280;
const height = 786;

const work = async ({ broker }) => {
  broker = broker.toLowerCase().replace(" ", "");

  try {
    // console.log(`${base}/visit/${broker}vs/`);
    const browser = await puppeteer.launch({ dumpio: true });
    const page = await browser.newPage();

    await page.goto(`${base}/visit/${broker}vs/`, {
      waitUntil: "networkidle2"
    });

    await page.setViewport({
      width,
      height
    });

    await page.screenshot({
      path: `images/vs-afflink-screenshots/${broker}.png`
      //   clip: {
      //     x: 0,
      //     y: 0,
      //     height: 200,
      //     width: 300
      //   },
      //   omitBackground: true
    });
    browser.close();
  } catch (err) {
    console.log(err.message);
  } finally {
    if (affLinks.length) {
      work(affLinks.pop());
    } else {
      process.exit();
    }
  }
};

work(affLinks.pop());
