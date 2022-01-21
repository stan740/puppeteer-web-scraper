const puppeteer = require('puppeteer');
const fs = require('fs/promises');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage()
    await page.goto("https://learnwebcode.github.io/practice-requests")

    // Collects the names of all animals in strong tags.
    const names = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".info strong")).map(x => x.textContent)
    })
    await fs.writeFile("names.txt", names.join("\r\n"))

    //Collects all images found on page and saves them onto a harddrive.
    //Note to self: $$eval() selects all instances of an element
    const photos = await page.$$eval("img", (imgs) => {
        return imgs.map(x => x.src)
    })

    //Obtains text revealed after a button has been clicked and outputs the result in the console.
    await page.click("#clickme")
    const clickedData = await page.$eval("#data", el => el.textContent)
    console.log(clickedData)

    await page.type("#ourfield", "blue")

    await Promise.all([page.click("#ourform button"), page.waitForNavigation()])


    const info = await page.$eval("#message", el => el.textContent)

    console.log(info)

    for (const photo of photos) {
        const imagepage = await page.goto(photo)
        await fs.writeFile(photo.split("/").pop(), await imagepage.buffer())
    }


    await browser.close();
})()
