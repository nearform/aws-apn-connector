'use strict';

const puppeteer = require('puppeteer');
const XLSX = require('xlsx');

const apn = {
  _browser: null,
  _page: null,
  _viewId: null,
  init: async (username, password, puppeteerOptions={}) => {
    if (!username || !password) {
      throw new Error('Authentication credentials are required');
    }
    if (!apn._browser) {
      apn._browser = await puppeteer.launch(puppeteerOptions);
    }
    const page = await apn._browser.newPage();
    await page.goto('https://partnercentral.awspartner.com/APNLogin', {
      waitUntil: 'networkidle2',
    });


    // email
    const emailInput = '#loginPage\\:loginForm\\:registerWhoEmailInput';
    await page.type(emailInput, username);

    // password
    const passInput = '#loginPage\\:loginForm\\:registerPassPasswordInput';
    await page.type(passInput, password);

    await page.click('#loginPage\\:loginForm\\:loginBtn');
    await page.waitForNavigation({waitUntil: 'networkidle2'});
    // go to the home
    await page.waitForSelector('.blueButtonLink');
    const blueButtonLink = await page.evaluate(() => {
      return document.querySelectorAll('.blueButtonLink')[1].href;
    });
    apn._viewId = blueButtonLink.split('viewId=')[1];
    apn._page = page;
    return page;
  },
  _opportunitiesXLSXtoJSON: (xlsx) => {
    console.log(xlsx);
    const workbook = XLSX.read(xlsx);
    console.log(workbook.SheetNames[0]);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // console.log(worksheet)
    return XLSX.utils.sheet_to_json(worksheet);
  },
  opportunities: async () => {
    const page = apn._page;
    const viewId = apn._viewId;
    // Go to the opportunity list page to access the functions enabled there
    await page.goto('https://partnercentral.awspartner.com/apex/OpportunityListPage', {waitUntil: 'domcontentloaded'});
    await page.waitForNavigation({waitUntil: 'networkidle2'});

    // When settled, access the packaged functions to trigger/enable
    // visualforce to prepare the data then gather via fetch the excel
    // file and return
    const opportunityXLSX = await page.evaluate(async (viewId) => {
      await opportunityExportPreConfirmation(viewId);
      const url = `https://partnercentral.awspartner.com/ExportXls?viewId=${viewId}&fs=PartnerOpportunityExport`;
      const d = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });
      return d.text();
    }, viewId);

    // convert to json objects
    return apn._opportunitiesXLSXtoJSON(opportunityXLSX);
  },
  certifications: async () => {
    return apn._getCSV('https://partnercentral.awspartner.com/PartnerCertificationDetailsExport');
  },
  _getCSV: async (url) => {
    const csv = await apn._page.evaluate(async (url) => {
      const d = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });
      return d.text();
    }, url);
    return csv;
  },
  close: async () => {
    return apn._browser ? apn._browser.close() : Promise.resolve();
  },
};


module.exports = apn;
