const puppeteer = require('puppeteer');

const apn = {
  _browser: null,
  _page: null,
  _viewId: null,
  init: async (username, password) => {
    if (!apn._browser) {
      apn._browser = await puppeteer.launch({
        // headless: false
      });
    }
    const page = await apn._browser.newPage();
    await page.goto("https://partnercentral.awspartner.com/APNLogin", { waitUntil: 'networkidle2' });

    // email
    await page.type('#loginPage\\:loginForm\\:registerWhoEmailInput', username);

    // password
    await page.type('#loginPage\\:loginForm\\:registerPassPasswordInput', password);

    await page.click('#loginPage\\:loginForm\\:loginBtn');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    // go to the home
    await page.waitForSelector(".blueButtonLink");
    const blueButtonLink = await page.evaluate(() => {
      return document.querySelectorAll('.blueButtonLink')[1].href;
    });
    apn._viewId = blueButtonLink.split("viewId=")[1];
    apn._page = page;
    return page;
  },

  aceOpportunities: async () => {
    const page = apn._page;
    const viewId = apn._viewId;
    await page.goto("https://partnercentral.awspartner.com/apex/OpportunityListPage", { waitUntil: 'domcontentloaded' });
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    const opportunityXLSX = await page.evaluate(async (viewId) => {
      await opportunityExportPreConfirmation(viewId);
      const url = `https://partnercentral.awspartner.com/ExportXls?viewId=${viewId}&fs=PartnerOpportunityExport`;
      const d = await fetch(url, {
        method: 'GET',
        credentials: 'include'
      });
      return d.text()
    }, viewId);

    return opportunityXLSX;
  },
  certifications: async () => {
    return apn._getCSV('https://partnercentral.awspartner.com/PartnerCertificationDetailsExport');
  },
  _getCSV: async (url) => {
    const csv = await apn._page.evaluate(async (url) => {
      const d = await fetch(url, {
        method: 'GET',
        credentials: 'include'
      })
      return d.text();
    }, url);
    // await apn._page.waitForTimeout(5000);
    return csv;
  },
  close: async () => {
    // await apn._page.waitForNavigation({ waitUntil: 'networkidle2' });
    return apn._browser ? apn._browser.close() : Promise.resolve();
  }
}


module.exports = apn;